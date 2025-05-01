# POE_APDS
# International Payment System

## 📌 Project Overview  
**International Payment System** — A secure, full-stack web application that allows customers to register, log in, and make international payments. Employees can verify and process transactions before submission to SWIFT.

---

## 🚀 Live Demo  
- **Frontend Customer**: [Live React App](https://sibareactfe-hzcnaxcfdqbyaddc.southafricanorth-01.azurewebsites.net/login)
- **Frontend Admin**: [Live React App](https://sibareactfe-hzcnaxcfdqbyaddc.southafricanorth-01.azurewebsites.net/employee)  
- **Swagger Docs**: [Swagger UI]([https://your-backend-link/swagger](https://sibapayment-cubwerbvhzfpbmg8.southafricanorth-01.azurewebsites.net/swagger/index.html))  

---

## 🔒 Security Features  
- Passwords are hashed and salted using ASP.NET Identity  
- Input validation using RegEx to whitelist characters  
- CORS policies enforced on backend  
- HTTPS enforced across all traffic  
- Rate limiting to prevent abuse  
- SonarCloud static code analysis for vulnerabilities  

---

## 🧪 CI/CD Pipeline   
- Includes SonarCloud integration for code quality and security analysis  

---
## 👤 Admin Demo Login  
- **Username**: `admin`  
- **Password**: `SibaAdmin`

- 
### 📝 CircleCI Configuration
The CircleCI pipeline is defined in the `.github/workflows/sonarcloud.yml` file. This file contains the steps for:
1. **Building the application** using Docker (or other specified services)
2. **Running tests** to ensure code quality and functionality
3. **Running SonarCloud analysis** to perform static code analysis and detect issues such as security vulnerabilities, bugs, and code smells.
4. **Deploying the application** to Azure once the build and tests pass.

### SonarCloud Integration
The CircleCI configuration is connected to **SonarCloud** for automatic analysis of each build. The following steps outline how this is done:
1. **Analysis Execution**: During the build process, the `sonar-scanner` tool is executed as part of the pipeline, which sends the source code to SonarCloud for analysis.
2. **Code Quality & Security**: SonarCloud provides a detailed analysis report, which is accessible via the SonarCloud dashboard. It checks for:
   - Bugs
   - Vulnerabilities
   - Code smells
   - Test coverage
