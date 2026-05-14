import os
from langchain_openai import ChatOpenAI
from langchain.agents import create_openai_functions_agent, AgentExecutor
from langchain_core.tools import tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from .vector_store import VectorStoreService


class AIAgentService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.vs_service = VectorStoreService()
        self.agent_executor = None

        if not self.api_key or self.api_key == "your_api_key_here":
            print("WARNING: OpenAI API Key not found. AI features will be limited.")
            return

        self.llm = ChatOpenAI(model="gpt-4", temperature=0, api_key=self.api_key)

        # --- Tool Definitions ---
        @tool
        def search_tax_kb(query: str) -> str:
            """Search the Tax Knowledge Base for GST rules, Income Tax Acts, and compliance information."""
            results = self.vs_service.similarity_search(query)
            if not results:
                return "No relevant information found in the knowledge base."
            return "\n\n".join([doc.page_content for doc in results])

        @tool
        def calculate_income_tax(income: float, regime: str = "new") -> str:
            """
            Calculate estimated Indian income tax liability.
            Args:
                income: Annual gross income in INR.
                regime: Tax regime - 'new' (default) or 'old'.
            """
            if regime == "new":
                std_deduction = 75000
                taxable_income = max(0, income - std_deduction)

                tax = 0
                if taxable_income <= 300000:
                    tax = 0
                elif taxable_income <= 600000:
                    tax = (taxable_income - 300000) * 0.05
                elif taxable_income <= 900000:
                    tax = 15000 + (taxable_income - 600000) * 0.10
                elif taxable_income <= 1200000:
                    tax = 45000 + (taxable_income - 900000) * 0.15
                elif taxable_income <= 1500000:
                    tax = 90000 + (taxable_income - 1200000) * 0.20
                else:
                    tax = 150000 + (taxable_income - 1500000) * 0.30

                # Rebate under Section 87A for taxable income <= 7 lakh
                if taxable_income <= 700000:
                    tax = 0

                cess = tax * 0.04
                total = tax + cess
                return (
                    f"**Income Tax Calculation (New Regime, FY 2024-25)**\n"
                    f"- Gross Income: ₹{income:,.0f}\n"
                    f"- Standard Deduction: ₹{std_deduction:,.0f}\n"
                    f"- Taxable Income: ₹{taxable_income:,.0f}\n"
                    f"- Base Tax: ₹{tax:,.2f}\n"
                    f"- Health & Education Cess (4%): ₹{cess:,.2f}\n"
                    f"- **Total Tax Payable: ₹{total:,.2f}**"
                )
            return "Old Regime calculation: Please consult a CA for detailed deduction-based calculation."

        self.tools = [search_tax_kb, calculate_income_tax]

        # Build prompt locally without langchain hub
        self.prompt = ChatPromptTemplate.from_messages([
            ("system",
             "You are TaxMind, an expert Indian tax assistant. "
             "You have deep knowledge of GST, Income Tax Act, compliance rules, "
             "and financial regulations in India. "
             "Always provide accurate, actionable advice with relevant section references. "
             "Use the search_tax_kb tool to retrieve relevant tax rules before answering. "
             "Use the calculate_income_tax tool when users ask about tax liability. "
             "Format your answers clearly with bullet points and bold headings where appropriate."),
            MessagesPlaceholder(variable_name="chat_history"),
            ("human", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])

        agent = create_openai_functions_agent(self.llm, self.tools, self.prompt)
        self.agent_executor = AgentExecutor(agent=agent, tools=self.tools, verbose=True)

    async def get_response(self, user_input: str, chat_history: list = None) -> str:
        if not self.agent_executor:
            return (
                "⚠️ **AI Agent is offline.**\n\n"
                "Please add your `OPENAI_API_KEY` to `backend/.env` and restart the server.\n\n"
                "Example: `OPENAI_API_KEY=sk-...`"
            )

        response = await self.agent_executor.ainvoke({
            "input": user_input,
            "chat_history": chat_history or []
        })
        return response["output"]
