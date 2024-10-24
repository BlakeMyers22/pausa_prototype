// pages/index.js
export default function Home() {
  return (
    <>
      <head>
        <title>PAUSA - Public Adjuster USA Network</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <div>
        <style jsx global>{`
          body {
              font-family: Arial, sans-serif;
              background-color: #f0f0f5;
              color: #333;
              margin: 0;
              padding: 0;
              line-height: 1.6;
          }
          header {
              background-color: #003366;
              color: white;
              padding: 20px;
              text-align: center;
          }
          header h1 {
              color: white;
              margin: 0;
          }
          .container {
              max-width: 800px;
              margin: 20px auto;
              padding: 0 20px;
          }
          #claimForm {
              margin-top: 20px;
              padding: 30px;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .form-group {
              margin-bottom: 20px;
          }
          label {
              display: block;
              margin-bottom: 5px;
              font-weight: bold;
          }
          textarea {
              width: 100%;
              padding: 10px;
              border: 1px solid #ddd;
              border-radius: 4px;
              resize: vertical;
              font-family: inherit;
          }
          button {
              background-color: #003366;
              color: white;
              padding: 12px 24px;
              border: none;
              border-radius: 5px;
              cursor: pointer;
              font-size: 16px;
              transition: background-color 0.3s ease;
          }
          button:hover {
              background-color: #00509e;
          }
          button:disabled {
              background-color: #cccccc;
              cursor: not-allowed;
          }
          #responseMessage {
              margin-top: 20px;
              padding: 15px;
              border-radius: 4px;
              white-space: pre-wrap;
          }
          .success {
              background-color: #e8f5e9;
              color: #2e7d32;
              border: 1px solid #c8e6c9;
          }
          .error {
              background-color: #ffebee;
              color: #c62828;
              border: 1px solid #ffcdd2;
          }
          .loading {
              display: none;
              text-align: center;
              margin: 20px 0;
          }
        `}</style>

        <header>
          <h1>Public Adjuster USA Network (PAUSA)</h1>
        </header>
        <div className="container">
          <form id="claimForm">
            <h2>Submit Your Claim</h2>
            <div className="form-group">
              <label htmlFor="notes">Damage Description:</label>
              <textarea 
                id="notes" 
                name="notes" 
                rows="4" 
                placeholder="Please describe the damage in detail" 
                required 
                minLength="10"
              ></textarea>
            </div>
            <button type="submit" id="submitButton">Submit Claim</button>
          </form>
          <div id="loading" className="loading">Processing your claim...</div>
          <div id="responseMessage"></div>
        </div>

        <script dangerouslySetInnerHTML={{ __html: `
          document.getElementById('claimForm').addEventListener('submit', async function(event) {
            event.preventDefault();
            
            const submitButton = document.getElementById('submitButton');
            const loadingDiv = document.getElementById('loading');
            const responseDiv = document.getElementById('responseMessage');
            const notesInput = document.getElementById('notes');
            
            submitButton.disabled = true;
            loadingDiv.style.display = 'block';
            responseDiv.className = '';
            responseDiv.textContent = '';
            
            try {
                const response = await fetch('/api/generate-claim', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        notes: notesInput.value
                    })
                });
                
                if (!response.ok) {
                    throw new Error('Server responded with status ' + response.status);
                }
                
                const result = await response.json();
                
                if (result.claim_text) {
                    responseDiv.textContent = result.claim_text;
                    responseDiv.className = 'success';
                    notesInput.value = '';
                } else {
                    throw new Error(result.error || 'Failed to generate claim');
                }
            } catch (error) {
                console.error('Error:', error);
                responseDiv.textContent = 'Error processing claim: ' + error.message;
                responseDiv.className = 'error';
            } finally {
                submitButton.disabled = false;
                loadingDiv.style.display = 'none';
            }
          });
        ` }} />
      </div>
    </>
  )
}
