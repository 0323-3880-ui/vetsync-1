# VetSync - ASTRID Pet Health Assistant 🐾

VetSync is a modern veterinary clinic platform featuring **ASTRID**, a 3-layer hybrid health assistant designed to provide safe, empathetic, and data-driven guidance for pet owners.

---

## 🚀 Key Features

- **ASTRID Hybrid Chatbot**: A clean, modern chat interface that handles both clinic FAQs and pet health queries.
- **3-Layer Intelligence**:
    1.  **Local FAQ**: Instant answers for clinic hours, services, and booking.
    2.  **Clinical Search**: Powered by matched veterinary datasets (12,000+ entries) for diseases and symptoms.
    3.  **AI Fallback**: Optional integration with Gemini 2.0 Flash for natural language conversation (Grounded in veterinary context).
- **Security & Privacy**: Built-in "Offline-First" mode that works perfectly without any API keys.

---

## 🛠️ Setup Instructions (For Groupmates)

To run this system locally, follow these steps:

### 1. Clone & Environment
```bash
git clone https://github.com/0323DxD/vetsync.git
cd vetsync

# Create a virtual environment
python -m venv venv
venv\Scripts\activate  # Windows
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Initialize the Databases
Run the processing scripts to compile the local knowledge base from the raw CSVs:
```bash
python dataset/scripts/download_vet_med.py
python dataset/scripts/process_datasets.py
```

### 4. Optional: Enable AI Mode
By default, the chatbot uses the local dataset. To enable the advanced AI features:
1. Create a file named `.env` in the root folder.
2. Add your key: `GEMINI_API_KEY=your_key_here`
3. Get a free key at [Google AI Studio](https://aistudio.google.com/apikey).

> [!WARNING]
> **NEVER** commit your `.env` file to GitHub. It is already added to `.gitignore` to protect your privacy.

### 5. Run the App
```bash
python app.py
```
Open [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

---

## 📂 Project Structure

- `app.py`: Main Flask backend with the 3-layer ASTRID logic.
- `dataset/`:
  - `raw/`: Raw clinical datasets.
  - `processed/`: The compiled `knowledge_base.json`.
  - `scripts/`: Data syncing and merge tools.
- `templates/chatbot.html`: The modern full-chat UI.

---

## 📄 License
Education project for VetSync Clinic.
