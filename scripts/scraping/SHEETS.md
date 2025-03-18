Go to the Google Cloud Console (https://console.cloud.google.com/)
Create a new project or select an existing one
Enable the Google Sheets API
Create a service account:
Go to "IAM & Admin" > "Service Accounts"
Click "Create Service Account"
Give it a name and description
Grant it appropriate roles (e.g., "Editor" if you need write access)
Create a key for the service account:
Click on the service account you just created
Go to the "Keys" tab
Click "Add Key" > "Create new key"
Choose JSON format
Download the key file
Once you have the key file:
Rename it to credentials.json
2. Place it in your project root directory (where your main.ts is located)