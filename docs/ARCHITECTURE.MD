# Architecture Documentation

## Tableau Hackathon 2025 - Project Architecture

### Overview
This document outlines the architecture and requirements for the Tableau Hackathon 2025 submission, based on the official rules and project specifications.

---

## 1. Project Requirements

### 1.1 Core Requirements
- **Platform**: Must use **Tableau Next** and/or **Tableau Cloud**
- **Purpose**: Develop a new solution that uses Tableau Next and/or Tableau Cloud to solve a business problem
- **Timeline**: Project must be newly created after the Hackathon Submission Period start date
- **Access**: 
  - Tableau Next: Request access via https://forms.gle/NA2cp7ZShGP6HUVy8
  - Tableau Cloud: Get access at https://tableau.com/developer

### 1.2 Platform-Specific Requirements

#### Tableau Next
- Must be intended for and run on the **Salesforce platform**
- Must use provisioned org only (no other orgs)
- Should leverage differentiating features:
  - Semantic Models
  - Agentforce
  - Deep Salesforce integration

#### Tableau Cloud
- Must use **Tableau Developer Platform**
- Must only support Tableau tools and APIs
- Should extend, strengthen, or integrate Tableau's power
- Can use:
  - Extensions API
  - Hyper API
  - VizQL Data Service
  - Embedding APIs

### 1.3 Technical Requirements
- **Functionality**: Must be fully functional and stable
- **Testing**: Must be available free of charge for testing/evaluation until Judging Period ends
- **Third-Party Integrations**: Must be authorized to use any third-party SDKs, APIs, or data
- **Hardware**: If using proprietary hardware, must provide physical access upon request

---

## 2. Submission Requirements

### 2.1 Required Components

1. **Working Project**
   - Built with required environments (provisioned orgs)
   - Fully functional and stable
   - Accessible for judging/testing

2. **Text Description**
   - Explain features and functionality
   - Must be in English (or with English translation)

3. **Demonstration Video**
   - Less than 5 minutes duration
   - Shows Project functioning on intended device/platform
   - Uploaded to YouTube, Vimeo, Facebook Video, or Youku
   - Must be publicly visible
   - No third-party trademarks or copyrighted music without permission

4. **Admin Credentials**
   - Provide admin credentials to provisioned org (Tableau Next)
   - Do NOT provide credentials to any other orgs

5. **Org ID** (Tableau Next only)
   - Include Org ID for provisioned org only

6. **1-2 Sentence Pitch**
   - Brief project summary

7. **Code Repository**
   - URL to GitHub or other code repository
   - If private, provide access to:
     - @kglover29
     - testing@devpost.com

8. **API/Tools Documentation**
   - List of APIs and developer tools used
   - Potential improvements if more time were permitted

### 2.2 Intellectual Property Requirements
- Must be original work
- Solely owned by Entrants
- Must not violate IP rights of others
- Open source software allowed if compliant with licenses
- Must enhance/build upon underlying open source products

### 2.3 Restrictions
- **No financial/preferential support** from Sponsor
- **No confidential/proprietary information**
- **No harmful/illegal content**
- **No malware, spyware, or viruses**
- **No source code/SDKs/APIs** that are not publicly discoverable

---

## 3. Judging Criteria

### Stage One: Pass/Fail
- Baseline viability check
- Must reasonably fit Submission Requirements

### Stage Two: Scoring (Equally Weighted)

#### I. Innovation & Creativity (40%)
- **Creativity and Originality**
  - How creative, unique, and imaginative?
  - Is the solution novel or significantly improved?
  - Does the concept already exist? How much improvement?

- **Use of Platform Features**
  - **Tableau Next**: Does it utilize Semantic Models, Agentforce, or deep Salesforce integration?
  - **Tableau Cloud**: Does it push boundaries of Extensions, APIs, or advanced visual techniques?

#### II. Technical Execution & Functionality (30%)
- **Application Functionality**
  - Fully functional and stable?
  - Executes intended analytical workflow smoothly?
  - No errors?

- **Complexity and Skill**
  - How challenging was the technical execution?
  - Demonstrates high skill in:
    - Data preparation (Prep)
    - Data modeling
    - API/SDK usage (embedding, Extensions API, Hyper API, VizQL Data Service)

#### III. Potential Impact (20%)
- **Problem-Solving**
  - Does it solve a genuine, real-world problem?

- **Measurable Value**
  - Potential impact?
  - Enables faster decision-making?
  - Increases efficiency?
  - Drives cost savings?
  - Provides new actionable insights?

#### IV. User Experience & Presentation Quality (10%)
- **Quality of Design (UX/UI)**
  - Intuitive and well thought out?
  - Readability, navigability, visual best practices

- **Video Submission**
  - Clear, compelling demonstration (3-5 minutes)
  - Fully showcases project, core functionality
  - Shows innovative use of Tableau

---

## 4. Prize Categories

### 4.1 Grand Prize
- **Amount**: USD $17,000
- **Selection**: Highest overall score across all criteria

### 4.2 Honorable Mention Categories (USD $7,000 each)
1. **Best Data Layer Implementation**
2. **Best Use of Semantic Modeling**
3. **Best Use of Actionable Analytics**
4. **Best Product Extensibility**

### 4.3 People's Choice
- **Prize**: Tableau Swag Basket (up to 5 per team)
- **Total ARV**: USD $1,500
- **Selection**: Highest verified votes during Public Voting Period

### 4.4 Prize Eligibility Rules
- An Eligible Submission may win:
  - Grand Prize OR one (1) Honorable Mention
  - Plus People's Choice (if applicable)
- **Cannot** win both Grand Prize and an Honorable Mention

---

## 5. Technical Architecture Considerations

### 5.1 For Tableau Next Projects
- **Salesforce Integration**
  - Leverage native Salesforce data models
  - Use Semantic Models for data abstraction
  - Integrate with Agentforce for AI-powered insights
  - Utilize Salesforce security and sharing models

- **Development Environment**
  - Use only provisioned org
  - Document Org ID
  - Provide admin credentials for judging

### 5.2 For Tableau Cloud Projects
- **Developer Platform**
  - Extensions API for custom functionality
  - Hyper API for data management
  - VizQL Data Service for querying
  - Embedding APIs for integration

- **Best Practices**
  - Follow Tableau design best practices
  - Optimize for performance
  - Ensure accessibility

### 5.3 Data Architecture
- **Data Sources**
  - Authorized third-party integrations only
  - Publicly available data sources preferred
  - Document all data sources and permissions

- **Data Modeling**
  - Semantic Models (Tableau Next)
  - Data preparation workflows
  - Efficient data structures

### 5.4 Security & Compliance
- **No Sensitive Data**
  - No confidential or proprietary information
  - No third-party personal information
  - No unauthorized IP

- **Security Reporting**
  - Report suspected security issues to security@salesforce.com
  - Do not disclose publicly until evaluated

---

## 6. Submission Timeline

### 6.1 Key Dates
- **Submission Period**: [Check Hackathon Website]
- **Public Voting Period**: [Check Hackathon Website]
- **Judging Period**: [Check Hackathon Website]

### 6.2 Submission Modifications
- **Draft Submissions**: Can save drafts before Submission Period ends
- **After Submission Period**: 
  - No changes to Submission
  - Can update Project in Devpost portfolio
  - Sponsor may permit modifications for:
    - Removing infringing material
    - Removing personally identifiable information
    - Removing inappropriate content

---

## 7. Project Documentation Requirements

### 7.1 Code Repository
- **Platform**: GitHub or similar
- **Access**: Public or private (with access for judges)
- **Contents**:
  - Source code
  - Configuration files
  - Documentation
  - README with setup instructions

### 7.2 README Requirements
- Project description
- Setup instructions
- API/tools used
- Architecture overview
- Testing instructions

### 7.3 Video Script Outline
1. **Introduction** (30 seconds)
   - Problem statement
   - Solution overview

2. **Demo** (3-4 minutes)
   - Key features
   - User workflow
   - Technical highlights
   - Platform-specific features

3. **Conclusion** (30 seconds)
   - Impact/value proposition
   - Future improvements

---

## 8. Best Practices for Success

### 8.1 Focus Areas (Based on Judging Criteria)
1. **Innovation** (40%): Prioritize creative, unique solutions
2. **Technical Execution** (30%): Ensure stability and demonstrate skill
3. **Impact** (20%): Solve real business problems
4. **UX/Presentation** (10%): Create intuitive design and compelling video

### 8.2 Platform Feature Utilization
- **Tableau Next**: Deeply integrate Semantic Models, Agentforce, Salesforce
- **Tableau Cloud**: Push boundaries with Extensions, APIs, advanced visuals

### 8.3 Quality Assurance
- Test thoroughly before submission
- Ensure no errors or crashes
- Verify all features work as described
- Test on intended platform/device

### 8.4 Presentation
- Create clear, professional video
- Highlight innovative features
- Show real-world use case
- Demonstrate technical complexity

---

## 9. Legal & Compliance

### 9.1 Intellectual Property
- All submissions remain property of Entrants
- Sponsor gets irrevocable, royalty-free license for:
  - Hackathon evaluation
  - Promotional purposes
- Entrants grant rights to use Submission in marketing materials

### 9.2 Representations & Warranties
- Original work
- No IP violations
- No harmful/illegal content
- Complies with employer policies (if applicable)

### 9.3 Eligibility
- Must be 18+ (20+ in Japan) or age of majority
- Legal residents of eligible countries
- Not employees/contractors of Sponsor or related entities
- Not government employees/officials

---

## 10. Next Steps

1. **Request Access**
   - Tableau Next: https://forms.gle/NA2cp7ZShGP6HUVy8
   - Tableau Cloud: https://tableau.com/developer

2. **Plan Architecture**
   - Choose platform (Next vs Cloud vs both)
   - Identify business problem
   - Design solution architecture

3. **Develop**
   - Build working prototype
   - Test thoroughly
   - Document code

4. **Prepare Submission**
   - Create demonstration video
   - Write project description
   - Prepare code repository
   - Complete submission form

5. **Submit**
   - Complete all required fields
   - Upload video link
   - Provide access credentials
   - Submit before deadline

---

## 11. Resources

- **Hackathon Website**: tableau2025.devpost.com
- **Tableau Next Access**: https://forms.gle/NA2cp7ZShGP6HUVy8
- **Tableau Cloud Developer**: https://tableau.com/developer
- **Devpost Terms**: https://info.devpost.com/legal/terms-of-service
- **Security Issues**: security@salesforce.com

---

*Last Updated: Based on Official Rules for Tableau Hackathon 2025*
