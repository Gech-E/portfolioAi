import pytest
from unittest.mock import MagicMock, patch
from app.services.llm_service import LLMService, BioOutput

@pytest.fixture
def llm_service():
    with patch('app.services.llm_service.settings') as mock_settings:
        mock_settings.openai_api_key = "test-key"
        mock_settings.openai_model_fast = "gpt-4o-mini"
        mock_settings.openai_model_primary = "gpt-4o"
        yield LLMService()

@pytest.mark.asyncio
async def test_generate_bio_mock(llm_service):
    # Test with no API key (should return mock)
    llm_service.api_key = None
    result = await llm_service.generate("PORTFOLIO_BIO", {"name": "Test"})
    
    assert result["status"] == "completed"
    assert "Mock" in result["result"]["content"]
    assert result["result"]["mock"] is True

@pytest.mark.asyncio
async def test_generate_bio_structured(llm_service):
    # Mock the LangChain components
    mock_llm = MagicMock()
    mock_structured_llm = MagicMock()
    
    mock_output = BioOutput(
        headline="Expert Developer",
        summary="Short summary",
        detailed_bio="Detailed bio"
    )
    
    # Mock ainvoke on the structured LLM directly if we can
    # But LLMService does prompt | structured_llm
    
    with patch.object(LLMService, '_get_llm', return_value=mock_llm):
        mock_llm.with_structured_output.return_value = mock_structured_llm
        
        # Mock the entire chain invoke
        with patch('app.services.llm_service.ChatPromptTemplate.from_messages') as mock_prompt:
            mock_chain = MagicMock()
            async def mock_ainvoke(*args, **kwargs):
                return mock_output
            mock_chain.ainvoke = mock_ainvoke
            
            # This is the tricky part: prompt | structured_llm
            mock_prompt.return_value.__or__.return_value = mock_chain
            
            result = await llm_service.generate("PORTFOLIO_BIO", {
                "name": "John",
                "role": "Dev",
                "skills": "Python",
                "background": "None"
            })
            
            assert result["status"] == "completed"
            assert result["result"]["headline"] == "Expert Developer"
            assert result["model"] == "gpt-4o-mini"
