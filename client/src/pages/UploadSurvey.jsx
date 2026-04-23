import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Layout from "../components/Layout";
import api from "../services/api";
import "./UploadSurvey.css";

const UploadSurvey = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selected.type)) {
      toast.error("Only JPG, PNG, WEBP images are allowed");
      return;
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setFile(selected);
    setResult(null);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(selected);
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select an image first");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("survey", file);
      const res = await api.post("/api/surveys/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data.survey);
      toast.success("Survey uploaded and text extracted!");
    } catch (error) {
      const message = error.response?.data?.message || "Upload failed";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
  };

  return (
    <Layout>
      <div className="upload-page">
        <div className="upload-header">
          <h1>Upload Survey</h1>
          <p>Upload a photo of a paper survey to extract data automatically</p>
        </div>

        <div className="upload-grid">
          <div className="upload-card">
            <h2>Select Image</h2>
            <div
              className="upload-area"
              onClick={() => document.getElementById("fileInput").click()}
            >
              {preview ? (
                <img src={preview} alt="Preview" className="preview-image" />
              ) : (
                <div className="upload-placeholder">
                  <div className="upload-icon">+</div>
                  <p>Click to upload survey image</p>
                  <span>JPG, PNG, WEBP up to 5MB</span>
                </div>
              )}
            </div>
            <input
              id="fileInput"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileChange}
              style={{ display: "none" }}
            />
            <div className="upload-actions">
              {file && (
                <button
                  onClick={handleReset}
                  className="btn-secondary"
                  disabled={loading}
                >
                  Reset
                </button>
              )}
              <button
                onClick={handleUpload}
                className="btn-primary"
                disabled={!file || loading}
              >
                {loading ? "Extracting text..." : "Upload & Extract"}
              </button>
            </div>
          </div>

          <div className="result-card">
            <h2>Extracted Data</h2>
            {!result && !loading && (
              <div className="result-empty">
                <p>Upload a survey image to see extracted data here</p>
              </div>
            )}
            {loading && (
              <div className="result-loading">
                <div className="spinner"></div>
                <p>Reading text from image...</p>
                <span>This may take a few seconds</span>
              </div>
            )}
            {result && (
              <div className="result-content">
                <div className="result-row">
                  <span className="result-label">Name</span>
                  <span className="result-value">
                    {result.extractedData?.name || "Not found"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Area</span>
                  <span className="result-value">
                    {result.extractedData?.area || "Not found"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Issue</span>
                  <span className="result-value">
                    {result.extractedData?.issue || "Not found"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Family Size</span>
                  <span className="result-value">
                    {result.extractedData?.familySize || "Not found"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Contact</span>
                  <span className="result-value">
                    {result.extractedData?.contact || "Not found"}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">Urgency</span>
                  <span
                    className={`badge badge-${result.extractedData?.urgency}`}
                  >
                    {result.extractedData?.urgency}
                  </span>
                </div>
                <div className="result-row">
                  <span className="result-label">AI Score</span>
                  <span className="ai-score">{result.aiUrgencyScore}/100</span>
                </div>

                {result.aiAnalysis && (
                  <div className="ai-analysis">
                    <p className="ai-analysis-title">🤖 AI Analysis</p>
                    <p className="ai-reasoning">
                      {result.aiAnalysis.reasoning}
                    </p>
                    <div className="result-row">
                      <span className="result-label">Action</span>
                      <span className="result-value">
                        {result.aiAnalysis.recommendedAction}
                      </span>
                    </div>
                    <div className="result-row">
                      <span className="result-label">Timeframe</span>
                      <span className="result-value">
                        {result.aiAnalysis.timeframe}
                      </span>
                    </div>
                  </div>
                )}

                <div className="result-raw">
                  <p className="result-label">Raw Text</p>
                  <pre>{result.rawText}</pre>
                </div>

                <button
                  onClick={() => navigate("/dashboard")}
                  className="btn-primary"
                  style={{ width: "100%", marginTop: "1rem" }}
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UploadSurvey;
