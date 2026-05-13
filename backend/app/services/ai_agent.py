import os
from langchain_openai import ChatOpenAI
from langchain_classic.agents import create_openai_functions_agent, AgentExecutor
from langchain import hub
from langchain_core.tools import tool
from .vector_store import VectorStoreService

class AIAgentService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        if not self.api_key or self.api_key == "your_api_key_here":
            self.llm = None
            print("WARNING: OpenAI API Key not found. AI features will be limited.")
        else:
            self.llm = ChatOpenAI(model="gpt-4", temperature=0)
        
        self.vs_service = VectorStoreService()
        
        # Define Tools
        @tool
        def search_tax_kb(query: str):
            """Search the Tax Knowledge Base for GST and Income Tax rules."""
            results = self.vs_service.similarity_search(query)
            return "\n".join([doc.page_content for doc in results])

        @tool
        def calculate_income_tax(income: float, regime: str = "new"):
            """Calculate income tax based on the provided income and tax regime (old/new)."""
            if regime == "new":
                # Simplified New Regime FY 2024-25 logic
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
                
                # Rebate under 87A (Simplified)
                if taxable_income <= 700000:
                    tax = 0
                    
                return f"Total Tax (New Regime): ₹{tax:,.2f}"
            return "Old Regime calculation not yet implemented."

        self.tools = [search_tax_kb, calculate_income_tax]
        
        # Create Agent
        prompt = hub.pull("hwchase17/openai-functions-agent")
        agent = create_openai_functions_agent(self.llm, self.tools, prompt)
        self.agent_executor = AgentExecutor(agent=agent, tools=self.tools, verbose=True)

    async def get_response(self, user_input: str, chat_history: list = None):
        if not self.llm:
            return "AI Agent is in offline mode. Please provide an OpenAI API Key in the `.env` file to enable full tax assistance capabilities."
        
        response = await self.agent_executor.ainvoke({
            "input": user_input,
            "chat_history": chat_history or []
        })
        return response["output"]
