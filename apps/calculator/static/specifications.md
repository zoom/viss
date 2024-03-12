<h1><p style="text-align: center;"><i>VISS</i></p></h1>
<p style="text-align: center;"><b>Vulnerability Impact Scoring System version 0.1</b></p>
<p style="text-align: center;"><b>Specification Document</b></p>
<p style="text-align: center;"><b>Revision 1.2</b></p>

The Vulnerability Impact Scoring System (VISS) is an open, customizable framework for evaluating the impact of security vulnerabilities upon computer systems infrastructure, technology stacks, and protected data. VISS analyzes thirteen different aspects of impact for each vulnerability, segmented into impact groups specific to the Platform, Infrastructure, and Data. The VISS calculation produces a score ranging from 0 to 100, which can then be modified by applying the Compensating Controls metric. A VISS score is represented as a vector string, a compressed textual representation of the metrics and corresponding values used to derive the score. This document provides the official specification for VISS version 1.0.

Zoom licenses VISS to the public under GPL-3.0.

- [1. Introduction](#1-introduction)
- [2. Metrics](#2-metrics)
  - [PLI - Platform Impacted](#pli---platform-impacted)
  - [ICI - Platform Confidentiality Impact](#ici---platform-confidentiality-impact)
  - [III - Platform Integrity Impact](#iii---platform-integrity-impact)
  - [IAI - Platform Availability Impact](#iai---platform-availability-impact)
  - [ITN - Infrastructure Tenancy](#itn---infrastructure-tenancy)
  - [STN - Software Tenancy](#stn---software-tenancy)
  - [DTN - Data Tenancy](#dtn---data-tenancy)
  - [TIM - Tenants Impacted](#tim---tenants-impacted)
  - [DCI - Data Confidentiality Impact](#dci---data-confidentiality-impact)
  - [DII - Data Integrity Impact](#dii---data-integrity-impact)
  - [DAI - Data Availability Impact](#dai---data-availability-impact)
  - [DCL - Data Classification Involved](#dcl---data-classification-involved)
  - [UCI - Upstream Compensating Controls](#uci---upstream-compensating-controls)
- [3. Scoring Equations](#3-scoring-equations)
  - [3.1 Equations](#31-equations)
- [4. Qualitative Severity Rating Scale](#4-qualitative-severity-rating-scale)
- [5. Acknowledgments](#5-acknowledgments)

### <a name="1-introduction"></a>1. Introduction
The Vulnerability Impact Scoring System (VISS) is designed to objectively capture the principal impact characteristics of software, hardware, and firmware vulnerabilities as they relate to the associated infrastructure, technology stack, and security of customer data. While the industry standard Common Vulnerability Scoring System (CVSS) is used to subjectively evaluate vulnerability reports primarily from an attacker’s perspective and assumes the reasonable worst-case impact, VISS focuses on measuring responsibly demonstrated impact from the defender’s perspective. The theoretical possibility of exploitation is not considered with VISS, only the actual exploitation that has been demonstrated. The numerical scores generated indicate the relative impact severity within the given environment. It is important to understand that VISS is not meant as a replacement for CVSS, but rather is a complementary system of evaluation from a different perspective.

A VISS analysis is composed of thirteen different aspects of impact for each vulnerability, segmented into impact groups specific to the Platform, Infrastructure, and Data. The VISS calculation produces a score ranging from 0 to 100, taking into account the selected values for all variables. VISS scores are typically produced by the organization maintaining the system, environment, network, or product in which a vulnerability has been identified, or an external party performing the evaluation on their behalf, such as a bug bounty triage team.

One main difference between VISS and CVSS is that although a default set is provided, the VISS metric options and the weights assigned to each of those options are customizable by the implementor as needed to meet the needs of the overall environment, software, and data involved. This flexibility allows each organization to utilize VISS in a manner specific to their industry, requirements, and risk profile. In addition, VISS takes into account impact reduction factors due to the presence of compensating controls. In this way, the VISS framework does not attempt to be a common one-size-fits-all all scoring methodology like CVSS. For example, a demonstrated vulnerability in one company’s mobile app may be very impactful. In contrast, the same vulnerability demonstrated in another company’s mobile app may be less impactful.

Implementers of VISS will typically utilize the resulting scores as input to a mature vulnerability management process that also considers other factors to prioritize threats to their technology infrastructure and help them make informed remediation decisions. Additional analysis may include a CVSS score, a STRIDE and/or DREAD model, the number of affected customers, potential financial loss, or the involvement of a threat to life or property. VISS provides the flexibility to create and add metric options to the VISS calculator to account for each of these additional variables if the implementing organization so chooses.

Like CVSS, VISS is a vendor and platform-agnostic vulnerability scoring methodology that provides transparency to the individual metrics and methodology used to derive a score. Unlike CVSS however, each metric receives an objective value, rather than a subjective value. Much discussion and disagreement have taken place regarding the subjective nature of the value selections available within the CVSS framework. In contrast, the VISS default metric options attempt to remove all subjective values from the calculation.

### <a name="2-metrics"></a>2. Metrics

<img src="/assets/figure1.png" width="70%">
<p style="font-weight: 300">Figure 1: VISS Metrics</p>

VISS is composed of thirteen different aspects of impact, segmented into impact groups specific to the Platform, Infrastructure, and Data. Similar to CVSS, each metric value option available for selection has a corresponding decimal value. Decimal values increase in relation to the perceived impact the identified security vulnerability has associated with that metric. For the majority, the higher the decimal value, the more impactful the vulnerability is for that metric. For some, the metric selection has a decimal value of less than one, reducing the overall score. The following describes the default set of metrics options.

#### <a name="pli---platform-impacted"></a>PLI - Platform Impacted

The Platform Impacted macro metric is represented by the variable PLI. This metric allows the user to specify the type of computing platform impacted by the security vulnerability, not necessarily where the security vulnerability was found. Zoom considers the Desktop and Mobile apps an extension of the Zoom infrastructure. The possible values for the PLI metric are:

- N/A
- Cloud Infrastructure
- Desktop
- Mobile
- Browser App / API Endpoint
- 3rd Party Hosted/Tool/Library
  
Cloud Infrastructure refers to any and all service infrastructure including containers, virtual machines, physical machines, network devices, and firewalls.

Desktop and Mobile refer to the extension of the service infrastructure to individual devices that host the end-user application. These metric options would be selected in cases where an exploited vulnerability in the application or device’s OS impacted the device itself.

Browser App / API Endpoint refers to an application running within the sandbox of a web browser, and/or the server-side API endpoints that allow data interaction between the browser, desktop, and mobile applications.

3rd Party Hosted/Tool/Library refers to any "company" branded application or website hosted and/or developed by a third-party developer, any tooling or application used within a "company" branded application or website, or any source code library, open-sourced or not, on which a "company" branded application or website is dependant.

The decimal value for each PLI option increases in relation to the perceived impact the identified security vulnerability has within the associated platform. The higher the decimal value, the more impactful the vulnerability is for that platform. If the user selects the N/A option, there is no impact on any platform, or no platform is involved, and the value of PLI does not affect the overall calculated score.

#### <a name="ici---platform-confidentiality-impact"></a>ICI - Platform Confidentiality Impact

The Platform Confidentiality Impact metric is represented by the variable ICI. This metric allows the user to specify the impact on the confidentiality of the platform by the successful exploitation of the security vulnerability found. The possible values for the ICI metric are:

- None
- Network/DNS Configuration
- Hardware Configuration
- Container Configuration
- OS Configuration
- Software Configuration
- PKI/Secrets Configuration
- User Account Configuration
  
The decimal value for each ICI option increases in relation to the perceived impact the identified security vulnerability has on the Confidentiality of the associated platform configuration. If the user selects the None option, there is no confidentiality impact involved, and the value of ICI does not affect the overall calculated score. If a value for ICI is provided, the ITN, STN, DTN, and TIM metrics are enabled within the calculator UI.

#### <a name="iii---platform-integrity-impact"></a>III - Platform Integrity Impact

The Platform Integrity Impact metric is represented by the variable III. This metric allows the user to specify the impact on the integrity of the Platform by the successful exploitation of the security vulnerability found. The possible values for the III metric are:

- None
- Network/DNS Configuration
- Hardware Configuration
- Container Configuration
- OS Configuration
- Software Configuration
- PKI/Secrets Configuration
- User Account Configuration
- Restricted PE / RCE
- Unrestricted PE / RCE

Restricted PE / RCE refers to Privilege Escalation or Remote Code Execution that is restricted in some way to the single account, with less than complete access rights.

Unrestricted PE / RCE refers to Privilege Escalation or Remote Code Execution that is not restricted in some way to the single account, and has complete access rights.

The decimal value for each III option increases in relation to the perceived impact the identified security vulnerability has on the Integrity of the associated platform configuration. If the user selects the None option, there is no integrity impact involved, and the value of III does not affect the overall calculated score. If a value for III is provided, the ITN, STN, DTN, and TIM metrics are enabled within the calculator UI.

#### <a name="iai---platform-availability-impact"></a>IAI - Platform Availability Impact

The Platform Availability Impact metric is represented by the variable IAI. This metric allows the user to specify the impact on the availability of the platform by the successful exploitation of the security vulnerability found. The possible values for the IAI metric are:

- None
- Single Service on Single Container/VM/Machine
- Single Service on Multiple Containers/VMs/Machines
- Single Service on all Containers/VMs/Machines within a portion of a Geographic Area
- Single Service on all Containers/VMs/Machines within an entire Geographic Area
- Single Service on all Containers/VMs/Machines within the entire Infrastructure
- Multiple Services on Single Container/VM/Machine
- Multiple Services on Multiple Containers/VMs/Machines
- Multiple Services on all Containers/VMs/Machines within a portion of a Geographic Area
- Multiple Services on all Containers/VMs/Machines within an entire Geographic Area
- Multiple Services on all Containers/VMs/Machines within the entire Infrastructure
- All Services on a Single Container/VM/Machine
- All Services on Multiple Containers/VMs/Machines
- All Services on all Containers/VMs/Machines within a portion of a Geographic Area
- All Services on all Containers/VMs/Machines within an entire Geographic Area
- All Services on all Containers/VMs/Machines within the entire Infrastructure
  
The decimal value for each IAI option increases in relation to the perceived impact the identified security vulnerability has on the Availability of the associated infrastructure. If the user selects the None option, there is no availability impact involved, and the value of IAI does not affect the overall calculated score. If a value for IAI is provided, the ITN, STN, DTN, and TIM metrics are enabled within the calculator UI.

#### <a name="itn---infrastructure-tenancy"></a>ITN - Infrastructure Tenancy

The Infrastructure Tenancy metric is represented by the variable ITN. This metric allows the user to specify the tenancy of the infrastructure on which the security vulnerability was found. Selections for this metric are only considered when there is some level of platform impact present. The possible values for the ITN metric are:

- N/A
- Single
- Multi
  
The decimal value for each ITN option increases in relation to the perceived impact the identified security vulnerability has due to the tenancy of the associated infrastructure. In many cases, the impact is more significant when a multi-tenant architecture is involved. If the user selects the N/A option the platform tenancy involved does not affect the impact, and the value of ITN does not affect the overall calculated score.

#### <a name="stn---software-tenancy"></a>STN - Software Tenancy

The Software Tenancy metric is represented by the variable STN. This metric allows the user to specify the tenancy of the software on which the security vulnerability was found. The possible values for the STN metric are:

- N/A
- Single
- Multi
  
The decimal value for each STN option increases in relation to the perceived impact the identified security vulnerability has due to the software tenancy of the associated infrastructure. In many cases, the impact is greater when a multi-tenant architecture is involved. If the user selects the N/A option the software tenancy involved does not affect the impact, and the value of ITN does not affect the overall calculated score.

#### <a name="dtn---data-tenancy"></a>DTN - Data Tenancy

The Data Tenancy metric is represented by the variable DTN. This metric allows the user to specify the tenancy of the data on which the security vulnerability was found. The possible values for the DTN metric are:

- N/A
- Single
- Multi
  
The decimal value for each DTN option increases in relation to the perceived impact the identified security vulnerability has due to the data tenancy of the associated infrastructure. In many cases, the impact is greater when a multi-tenant architecture is involved. If the user selects the N/A option the data tenancy involved does not affect the impact, and the value of DTN does not affect the overall calculated score.

#### <a name="TIM---tenants-impacted"></a>TIM - Tenants Impacted

The Tenants Impacted metric is represented by the variable TIM. This metric allows the user to specify a summary range of tenants impacted by the successful exploitation of the security vulnerability found. The possible values for the TIM metric are:

- None
- Dev Only
- One
- Many
- All
  
If the user selects the “Dev Only” option, the value of TIM reduces the overall VISS score because the impact on a development environment is typically less than the impact on a production environment. If the user selects the “None” option, the value of TIM does not affect the overall calculated score.

#### <a name="dci---data-confidentiality-impact"></a>DCI - Data Confidentiality Impact

The Data Confidentiality Impact metric is represented by the variable DCI. This metric allows the user to specify the impact on the confidentiality of the data involved by the successful exploitation of the security vulnerability found. The possible value sets for the DCI metric are:

- None
- Single User - Data Only
- Single User - Session Takeover (STO)
- Single User - Account Takeover (ATO)
- Multiple Users - Data Only
- Multiple Users - Session Takeover (STO)
- Multiple Users - Account Takeover (ATO)
- Single Organization - Data Only
- Multiple Organizations - Data Only
- Cross-Organizations - Data Only
- All Organizations - Data Only
  
An organization refers to a single entity to which a set of users is associated. If this option is selected for the DCI metric, this would mean that all users associated with a single organization are impacted.

The Cross-Organizations option refers to an exploited vulnerability that begins in organization A and impacts the confidentiality of data in organization B.

Session Takeover refers to an exploited vulnerability in which the attacker assumes access to a user’s current authenticated session, but is unable to escalate to Account Takeover because the attacker is unable to reset the user’s current password or complete MFA requirements.

Account Takeover refers to an exploited vulnerability in which the attacker assumes access to a user’s current authenticated session, and is able to escalate to Account Takeover by changing the user’s current password and altering or completing MFA requirements.

The decimal value for each DCI option increases in relation to the perceived impact the identified security vulnerability has on the Confidentiality of the data involved. If the user selects the None option, there is no confidentiality impact involved, and the value of DCI does not affect the overall calculated score. If a value for DCI is provided, the DCL metric is enabled within the calculator UI..

#### <a name="dii---data-integrity-impact"></a>DII - Data Integrity Impact

The Data Integrity Impact metric is represented by the variable DII. This metric allows the user to specify the impact on the integrity of the data involved by the successful exploitation of the security vulnerability found. The possible value sets for the DII metric are:

- None
- Single User - Data Only
- Single User - Session Takeover (STO)
- Single User - Account Takeover (ATO)
- Multiple Users - Data Only
- Multiple Users - Session Takeover (STO)
- Multiple Users - Account Takeover (ATO)
- Single Organization - Data Only
- Multiple Organizations - Data Only
- Cross-Organizations - Data Only
- All Organizations - Data Only
  
An organization refers to a single entity to which a set of users is associated. If this option is selected for the DII metric, this would mean that all users associated with a single organization are impacted.

The Cross-Organizations option refers to an exploited vulnerability that begins in organization A and impacts the integrity of data in organization B.

Session Takeover refers to an exploited vulnerability in which the attacker assumes access to a user’s current authenticated session, but is unable to escalate to Account Takeover because the attacker is unable to reset the user’s current password or complete MFA requirements.

Account Takeover refers to an exploited vulnerability in which the attacker assumes access to a user’s current authenticated session, and is able to escalate to Account Takeover by changing the user’s current password and altering or completing MFA requirements.
The decimal value for each DII option increases in relation to the perceived impact the identified security vulnerability has on the Integrity of the data involved. If the user selects the None option, there is no integrity impact involved, and the value of DII does not affect the overall calculated score. If a value for DII is provided, the DCL metric is enabled within the calculator UI.

#### <a name="dai---data-availability-impact"></a>DAI - Data Availability Impact

The Data Availability Impact metric is represented by the variable DAI. This metric allows the user to specify the impact on the availability of the data involved by the successful exploitation of the security vulnerability found. The possible value sets for the DAI metric are:

- None
- Single User
- Multiple Users
- Single Organization
- Multiple Organizations
- Cross-Organizations
- All Organizations
  
An organization refers to a single entity to which a set of users is associated. If this option is selected for the DAI metric, this would mean that all users associated with a single organization are impacted.

The Cross-Organizations option refers to an exploited vulnerability that begins in organization A and impacts the availability of data in organization B.

The decimal value for each DAI option increases in relation to the perceived impact the identified security vulnerability has on the Availability of the data involved. If the user selects the None option, there is no availability impact involved, and the value of DAI does not affect the overall calculated score. If a value for DAI is provided, the DCL metric is enabled within the calculator UI.

#### <a name="dcl---data-classification-involved"></a>DCL - Data Classification Involved

The Data Classification Involved metric is represented by the variable DCL. This metric allows the user to specify the internal classification of the data involved in the successful exploitation of the security vulnerability found. The possible value sets for the DCL metric are:

- None
- Test Data Only
- Company Public
- Company Internal
- Company Restricted
- Customer - Content
- Customer - Confidential
- Customer - Irreplaceable
- Customer - Personal Data
- Customer - Personally Identifiable Data
  
Test Data Only refers to systems in which the data contains no actual customer reference. This may be auto-generated or manually entered, containing for example addresses such as “123 Some Street” or names like “John Doe”. Exposure of this data poses no threat and has no impact on the organization.

Company Public, Internal, Confidential, and Restricted refer to data classifications associated with the company implementing VISS. These data classifications are typically provided by the internal risk team.

Customer Content data includes video, audio, application feature data of any kind, polls and survey information, chat and SMS/MMS messages, transcriptions, cloud-stored data, registration and engagement information, reports, calendar data, and contacts. This list is not all-inclusive.

Customer Confidential data includes any and all contact information for an account, including name, address, phone number, email address, billing address, subscription information, profile picture(s), and display name.

Customer Irreplaceable refers to data that can not be retrieved once deleted.

Customer Personal Data is any data from or about a natural person that identifies or could be used to identify, contact, or locate a unique individual or household; OR could be linked to a unique individual, or a unique identifier, including a user ID or username, contact information, SSN, drivers license information, account number, biometric information, browser cookies, device ID, browser ID, or IP address. This list is not all-inclusive.

Customer Personally Identifiable Data refers to any information that can be used to distinguish one individual from another. Note that Personal Data is a broader designation than Personally Identifiable Information (“PII”).

The decimal value for each DCL option increases in relation to the perceived sensitivity of the data involved. If the user selects the “Test Data Only” option, the value of DCL reduces the overall VISS score because the impact on test data is typically less than the impact on production data. If the user selects the “None” option, the value of DCL does not affect the overall calculated score.

#### <a name="uci---upstream-compensating-controls"></a>UCI - Upstream Compensating Controls

The Upstream Compensating Controls metric is represented by the variable UCI. This metric allows the user to specify the existence of any compensating security controls within the impacted software or infrastructure that have a positive defensive impact against the successful exploitation of the security vulnerability found. The possible value sets for the UCI metric are:

- N/A
- Limits Impact
- Prevents Impact
  
If the user selects the “N/A” option, the value of UCI will not affect the overall calculated score. This metric is used to reduce a VISS score based on the presence of security control that reduces or eliminates actual impact. The presence of compensating controls may not be apparent initially to the attacker or defender and can be modified post-initial triage.

### <a name="3-scoring-equations"></a>3. Scoring Equations

Once the active VISS metrics are assigned values, a score is calculated using a set of equations that take into account the weight assigned to each variable and their relation and impact on each other. The approach is referred to as a relational weighted average. Calculating the relational weighted average involves multiplying each data point by its weight and summing those products. Then summing the weights for all data points, and dividing the weight*value products by the sum of the weights. Along the way, we multiply the impact reduction factors and align the influencing variables within the equation such that we account for their hierarchical impact.

Influencing variables are defined as those which increase or decrease the VISS score at a macro level. During the design of VISS, it was determined that the Platform Impacted (PLI) variable would occupy this distinction, as research indicated that the wide range of differences between computing platforms contained the most variability. Hence, each PLI option will dictate the maximum possible value for the resulting VISS score, depending on the weights assigned by the implementor of VISS for a specific organization. The Compensating Controls Impact (UCI) variable is an example of an influencing variable that is only capable of VISS score reduction and can be referred to as an impact reduction factor.

The VISS calculation has three additional built-in influencing variables referenced as MA, MB, and MC, that allow for magnitude rebasing in cases where the implementor of VISS for an organization has determined that one or more areas of VISS are more or less impactful in their specific case. The values for these variables range between 0 and 1. Each impact area of VISS, Platform, Tenancy, and Data, are calculated separately and these magnitude rebasing factors are then applied

#### <a name="31-equations"></a>3.1 Equations

$$FA: Infrastructure$$
$$FB: Tenancy$$
$$FC: Data$$

$$SUM = FA + FB + FC$$

$$F1 = MAX(FA, FB, FC)$$

$$F2 = Fx \in [FA, FB, FC]; Fx \ne F1$$

$$F3 = Fx \in [FA, FB, FC]; Fx \ne F1, Fx \ne F2$$

$$VISS = F1 * (1 + F2/SUM) * (1 + F3/SUM) * UCI$$

$$VISS = MIN(VISS,100)$$


### <a name="4-qualitative-severity-rating-scale"></a>4. Qualitative Severity Rating Scale
It is useful in many circumstances to represent a range of numeric VISS scores with a common label. All scores can be mapped to the qualitative ratings defined in Table 1.

| Rating | VISS Score |
|-|-|
| None | 0 - 9 |
| Low | 9.01 - 39 |
| Medium | 39.01 - 69 |
| High | 69.01 - 89 |
| Critical | 89.01 - 100 |

As an example, a VISS score of 55 has an associated severity rating of Medium. The use of these qualitative severity ratings is optional, and there is no requirement to include them when publishing VISS scores. They are intended to help organizations properly assess and prioritize their vulnerability management processes.

### <a name="5-acknowledgments"></a>5. Acknowledgments
Zoom sincerely recognizes the contributions of the following VISS Special Interest Group (SiG) members, listed in alphabetical order:

Allison DiNicola (Zoom)\
Andy Grant (Zoom)\
Augustus Ralph (HackerOne)\
Chase Proctor (Zoom)\
Chris Ball (Zoom)\
Clara Andress (Zoom)\
Ed Huang (Zoom)\
Gavin See (HackerOne)\
Gerardo Covarrubias (Zoom)\
Karan Lyons (Zoom)\
Luciano Corsalini (HackerOne)\
Marcos Serrano (Zoom)\
Marcos Vinicius (Security Researcher)\
Matt Nagel (Zoom)\
Robert Wesson (Zoom)\
Roy Davis (Zoom)\
Santiago Lopez (Security Researcher)\
Tom Anthony (Security Researcher)\
Walter Carbajal (Zoom)\
Zach Torre (Zoom)