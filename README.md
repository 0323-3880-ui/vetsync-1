# VetSync - ASTRID Pet Health Assistant

VetSync is a modern veterinary clinic platform featuring **ASTRID**, an advanced pet health assistant chatbot powered by clinical datasets.

## 🚀 Key Features

- **ASTRID Chatbot**: A clean, modern assistant that handles both clinic FAQs and pet health questions.
- **Health Advice System**: Powered by veterinary clinical data (10,000+ records) and disease datasets. Provides causes, first aid, and "See a Vet" warnings.
- **Species Filtering**: Tailored advice for Dogs, Cats, Rabbits, Birds, and Reptiles.
- **Smart Booking**: Integrated shortcuts to the appointment booking system within health responses.
- **User Dashboard**: Manage pet profiles and appointments (requires log in).

## 🛠️ Setup Instructions

To run this system locally:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/0323DxD/vetsync.git
   cd vetsync
   ```

2. **Create a virtual environment** (optional but recommended):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```
   The app will be available at `http://127.0.0.1:5000`.

## 📂 Project Structure

- `app.py`: Main Flask backend handling routes and API.
- `dataset/`:
  - `raw/`: Raw CSV datasets (Disease, Clinical).
  - `processed/`: The compiled `knowledge_base.json` used by ASTRID.
  - `scripts/`: Data processing and verification tools.
- `static/`: CSS and specialized images (ASTRID avatar, pet photos).
- `templates/`: HTML templates (including the redesigned `chatbot.html`).

## 🐾 Updating the Knowledge Base

If you add new datasets to `dataset/raw/`, you can rebuild the processed knowledge base by running:
```bash
python dataset/scripts/process_datasets.py
```

## 📄 License
This project is for educational purposes for the VetSync Clinic group project.
