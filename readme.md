I have just tried to simulate auto login in IRCTC website bypassing NLP captcha or normal captcha using headless browsing through puppeteer - a nodejs library for headless chrome!!!
Currenty you may need to run the script multiple times to get the desried results and I will work for the improvement overtime!!!

Requirements:
OCR.SPACE API Key (completely free!)

Packages:
jimp: ^0.2.28,
ocr-space-api: ^1.0.1,
puppeteer: ^0.12.0,
request: ^2.83.0

Run "npm install" inside the directory. It will download and install the required dependencies!
Set username, passsword and api key inside irctc.js and save.

Run the script with "node irctc" command!!!

Find captcha detection screenshot!

You may have to try three to four times to get the desired output!!!
Will be working for better efficieny ;-)

