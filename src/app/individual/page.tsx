'use client';

import dynamic from 'next/dynamic';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import individualImg from '../../../public/images/individual.jpg';

// dynamic icons
const FaFileAlt = dynamic(() => import('react-icons/fa').then(m => m.FaFileAlt), { ssr: false });
const FaEdit = dynamic(() => import('react-icons/fa').then(m => m.FaEdit), { ssr: false });
const FaShieldAlt = dynamic(() => import('react-icons/fa').then(m => m.FaShieldAlt), { ssr: false });
const FaChartLine = dynamic(() => import('react-icons/fa').then(m => m.FaChartLine), { ssr: false });
const FaIdCard = dynamic(() => import('react-icons/fa').then(m => m.FaIdCard), { ssr: false });
const FaGlobe = dynamic(() => import('react-icons/fa').then(m => m.FaGlobe), { ssr: false });
const FaFileInvoice = dynamic(() => import('react-icons/fa').then(m => m.FaFileInvoice), { ssr: false });

export default function IndividualPage() {
  const [activeService, setActiveService] = useState("federal");
  const contentRef = useRef<HTMLDivElement>(null);

  const handleServiceClick = (serviceId: string) => {
    setActiveService(serviceId);
    // First scroll to navigation
    const navSection = document.querySelector('.sticky-nav');
    navSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // Then after a delay, adjust scroll position to show the content
    setTimeout(() => {
      window.scrollTo({
        top: (contentRef.current?.offsetTop || 0) - 120, // Adjust this value based on your header height
        behavior: 'smooth'
      });
    }, 100);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  const services = [
    {
      id: "federal",
      icon: <FaFileAlt size={24} />,
      title: "Federal, State & Local Tax Filing Services",
      shortDesc: "Expert preparation of your tax returns",
      mainDesc: "At Cognitax, we specialize in end-to-end tax filing solutions for individuals across the United States. Whether you're a U.S. resident, non-resident, or someone with multi-state obligations, our expert team ensures accurate, compliant, and timely filings.",
      federalServices: {
        title: "Federal Tax Filing",
        items: [
          "Form 1040 – U.S. Individual Income Tax Return",
          "Form 1040-NR – For non-resident aliens",
          "Form 1040X – Amended returns",
          "All relevant schedules and attachments based on your income, deductions, and credits"
        ]
      },
      stateServices: {
        title: "State Tax Filing (All 50 States)",
        items: [
          "Resident and non-resident state returns",
          "Multi-state income allocations",
          "State-specific deductions and credits",
          "Compliance with state deadlines and filing standards"
        ]
      },
      localServices: {
        title: "City & County Tax Returns",
        items: [
          "City income Taxes (KY, MI, NY, OH, PA)",
          "County taxes (IN, MD, IA)"
        ]
      },
      benefits: {
        title: "Why Choose Us?",
        items: [
          <> <b>Accuracy & Transparency:</b> Every return is reviewed for compliance and clarity </>,
          <> <b>Digital Convenience:</b> 100% online fulfillment with secure document handling </>,
          <> <b>Personalized Support:</b> Tailored guidance based on your residency, income sources, and filing status </>,
          <> <b>Peace of Mind:</b> We handle the complexity so you can focus on what matters </>,
        ]

      }
    },
    {
      id: "amendment",
      icon: <FaEdit size={24} />,
      title: "Amended Tax Filings",
      shortDesc: "Correct previously filed returns",
      mainDesc: "Our amendment services help you correct past tax returns, ensuring accuracy and maximizing your benefits. Whether you've discovered new deductions, received late documents, or need to fix errors, our experts guide you through the process.",
      services: {
        title: "Federal Amendments (Form 1040-X)",

        items: [
          " Form 1040-X – For U.S. residents needing to update income, deductions, credits, or filing status",
          "Form 1040-NR-X – For non-resident aliens amending prior returns.",
          "Missed income (e.g., late 1099s or W-2s)",
          "Unclaimed deductions or credits (education, medical, energy)",
          "Filing status corrections",
          "Itemized vs. standard deduction adjustments."

        ]
      },
      stateServices: {
        title: "State Amendments (All 50 States)",
        items: [
          "State-level amendments for income, residency, or credit updates",
          "Multi-state corrections for clients with income across jurisdictions",
          "Timely submission within state-specific amendment windows."
        ]
      },
      localServices: {
        title: "City & County Amendments",
        items: [
          " Amend local income tax filings (e.g., NYC, Detroit, Philadelphia)",
          "Correct business license or local tax filings where applicable."
        ]
      },
      benefits: {
        title: "What You Get",
        items: [
          <>
            <b>Thorough Review:</b> We compare your original and corrected returns line-by-line
          </>,
          <>
            <b>Clear Documentation:</b> Every change is explained and supported
          </>,
          <>
            <b>Deadline Compliance:</b> Amendments filed within IRS/state timeframes (typically 3 years)
          </>,
          <>
            <b>Secure Handling:</b> All documents processed digitally with full confidentiality
          </>
        ]

      }
    },
    {
      id: "representation",
      icon: <FaShieldAlt size={24} />,
      title: "Tax Representation & Audit Support",
      shortDesc: "Professional IRS issue resolution",
      mainDesc: "We provide expert representation before the IRS and state tax authorities, protecting your interests and helping resolve tax-related issues efficiently.",
      services: {
        title: "Representation Servics",
        items: [
          "IRS audit representation",
          "Tax notice responses",
          "Penalty abatement requests",
          "Payment plan negotiations"
        ]
      },
      benefits: {
        title: "What We Do for You",
        items: [
          <><b>Strategic Defence:</b> We analyse your case and build a strong response</>,
          <><b>Document Management:</b> We compile and submit all required records</>,
          <><b>Resolution Focused:</b> We aim to resolve issues quickly and favourably.</>
        ]
      }
    },
    {
      id: "planning",
      icon: <FaChartLine size={24} />,
      title: "Advanced Tax Planning",
      shortDesc: "Strategic tax planning services",
      mainDesc: "At Secure Tax Files, we don’t just file taxes—we help you plan smarter. Our Advanced Tax Planning services are designed for individuals and businesses seeking to minimize liabilities, optimize cash flow, and align their tax strategy with long-term financial goals.",
      services: {
        title: "Strategic Tax Planning for Individuals",
        items: [
          "Reduce taxable income through smart deductions and credits",
          "Optimize investment portfolios for tax efficiency",
          "Plan for education, and retirement savings",
          "Utilize tax-advantaged accounts (e.g., IRAs, HSAs, 529 plans)",
          "Structure income from multiple sources (freelance, rental, dividends) to reduce overall tax burden"
        ]
      },
      process: {
        title: "Multi-Jurisdiction & International Planning",
        items: [
          " Multi-state income allocation.",
          "Foreign income and asset reporting (FBAR, FATCA).",
          "Tax treaty benefits for non-residents and expats.",
          "Cross-border structuring for global entrepreneurs."
        ]
      },
      benefits: {
        title: "Risk Management & Compliance",
        items: [
          "Legally sound and compliant with IRS and state regulations",
          "Audit-ready, with clear documentation and defensible positions",
          "Future-proof, adapting to changes in tax laws and business growth"
        ]
      }
    },
    {
      id: "itin",
      icon: <FaIdCard size={24} />,
      title: "ITIN Services",
      shortDesc: "Individual Taxpayer ID Number services",
      mainDesc: "We provide comprehensive ITIN (Individual Taxpayer Identification Number) services for non-U.S. citizens who need to comply with U.S. tax requirements but are ineligible for Social Security Numbers.",
      services: {
        title: "ITIN Services",
        items: [
          "New ITIN applications (Form W-7)",
          "ITIN renewals",
          "Family ITIN applications",
          "Documentation certification"
        ]
      },
      process: {
        title: "Who Needs an ITIN?",
        items: [
          "Dependents & spouses of U.S. taxpayers who need to be claimed on returns.",
          "Foreign business owners operating in the U.S. or selling through platforms like Amazon, Stripe, or PayPal.",
          "International freelancers & contractors receiving 1099 income."
        ]
      },
      benefits: {
        title: "What We Do",
        items: [
          <>Form W-7 Preparation – Complete and accurate application for ITIN.</>,
          <>Document Verification – Guidance on acceptable ID and foreign status documents.</>,
          <>Federal Tax Filing Support – Attach ITIN application to Form 1040 or 1040-NR.</>,
          <>Certified Acceptance Agent (CAA) Coordination.</>
        ]
      }
    },
    {
      id: "fbar",
      icon: <FaGlobe size={24} />,
      title: "FBAR Compliance",
      shortDesc: "Foreign Bank Account Reporting",
      mainDesc: (
        <div className="space-y-4">
          <p>
            If you hold financial assets outside the U.S., you may be required to file an FBAR (Foreign Bank Account Report). At Secure Tax Files, we provide expert guidance and filing support to help individuals and businesses stay compliant with federal regulations and avoid costly penalties.
          </p>
          <div>
            <h4 className="text-lg font-bold mb-2">What Is FBAR?</h4>
            <p className="mb-2">
              FBAR refers to FinCEN Form 114, which must be filed annually by U.S. taxpayers who:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Have foreign financial accounts (bank, brokerage, pension, etc.)</li>
              <li>Exceed an aggregate value of $10,000 at any time during the calendar year</li>
              <li>Include U.S. citizens, residents, green card holders, and certain entities</li>
              <li>Have signature authority over foreign accounts, even if not owned directly</li>
            </ul>
          </div>
        </div>
      ),
      services: {
        title: "FBAR Services",
        items: [
          "FinCEN Form 114 preparation",
          "Account aggregation and reporting",
          "Late FBAR filing assistance",
          "Compliance verification"
        ]
      },
      process: {
        title: "What We Do",
        items: [
          " Eligibility Assessment – We determine if FBAR applies to your situation",
          "Account Aggregation – We calculate total balances across all foreign accounts",
          "Form Preparation & E-Filing – We complete and submit your FBAR",
          "Documentation Support – We help gather and organize account statements and records",
          "Compliance Review – We ensure alignment with IRS and FinCEN rules"

        ]
      },
      benefits: {
        title: "Why Choose Us?",
        items: [
          <ul key="benefits-list" className="list-disc ml-6 space-y-2">
            <li><b>Secure Process</b> – Your sensitive financial data is handled with strict confidentiality</li>
            <li><b>Global Perspective</b> – We support expats, foreign investors, and multi-jurisdiction clients</li>
            <li><b>Peace of Mind</b> – Avoid penalties and stay compliant with proactive reporting</li>
          </ul>
        ]
      }
    },
    {
      id: "w4",
      icon: <FaFileInvoice size={24} />,
      title: "W-4 Planning",
      shortDesc: "Withholding Tax Optimization",
      mainDesc: <>Starting a new job or updating your tax profile? The W-4 form determines how much federal income tax is withheld from your paycheck—and getting it right can mean the difference between a surprise tax bill or a smooth refund. At Secure Tax Files, we guide you through every step of the W-4 process to ensure your withholding matches your financial reality.
        <br /><br /><b>What Is Form W-4?</b><br />
        Form W-4, officially titled the Employee’s Withholding Certificate, tells your employer how much federal tax to withhold from your wages. It’s based on:
        <br /> <ul className="list-disc ml-6 mt-2">
          <li><b>Your filing status</b></li>
          <li><b>Number of dependents</b></li>
          <li><b>Additional income or deductions</b></li>
          <li><b>Whether you want extra withholding</b></li>
        </ul><b /> <br /> You should update your W-4 whenever your financial situation changes—like getting married, having a child, or starting a side hustle.</>,
      services: {
        title: "What We Do",
        items: [
          " Step-by-step guidance through each section of Form W-4",
          "Help choosing the right filing status and dependent claims",
          "Adjustments for freelancers, contractors, and visa holders (H1B, OPT, F1)",
          "Withholding calculators to estimate your ideal paycheck deductions",
          "Review of your current W-4 to avoid under- or over-withholding"
        ]

      },
      process: {
        title: "When to Update Your W-4",
        items: [
          "Starting a new job",
          "Changes in income, marital status, or dependents",
          "Launching a side business or freelance work",
          "Receiving investment or rental income",
          "Planning for retirement or major life events"
        ]
      },
      benefits: {
        title: "Why Choose Us?",
        items: [
          <>
            <b>Personalized Support</b> – Tailored advice based on your income, goals, and tax profile
          </>,
          <>
            <b>IRS-Compliant Filing</b> – Accurate and up-to-date with current tax laws
          </>,
          <>
            <b>Peace of Mind</b> – Avoid year-end surprises and keep your paycheck balanced
          </>
        ]

      }
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="relative text-white py-24 overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[url('/tax-pattern.svg')] opacity-10"></div>

        {/* Optimized background via next/image */}
        <div className="absolute inset-0 -z-10">
          <Image
            src={individualImg}
            alt="Individual background"
            fill
            style={{ objectFit: 'cover' }}
            quality={60}
            sizes="100vw"
            placeholder="blur"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/25" aria-hidden="true" />
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8"
            >
              Individual Tax Services
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl mb-10 leading-relaxed"
            >
              Comprehensive tax services tailored to your individual needs
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Quick Navigation - Added sticky-nav class */}
      <section className="sticky-nav bg-gray-50 py-8 sticky top-20 z-40 border-b shadow-sm">
        <div className="container mx-auto px-4 overflow-x-auto">
          <div className="flex space-x-4 min-w-max">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className={`px-4 py-2  rounded-lg shadow hover:shadow-md transition-all text-sm font-medium 
                  ${activeService === service.id 
                    ? 'bg-[#006666] text-white ' 
                    : 'text-gray-700'}`}
              >
                <Link href={`#${service.id}`} prefetch={false}>{service.title}</Link>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Service Content Section */}
      <section ref={contentRef} className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          {services
            .filter(service => service.id === activeService)
            .map((service) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="max-w-5xl mx-auto space-y-8"
              >
                {/* Main Description */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h2>
                  <p className="text-lg text-gray-700 leading-relaxed">{service.mainDesc}</p>
                </div>

                {service.id === "federal" || service.id === "amendment" ? (
                  <>
                    {/* Federal Services */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4"> {service.services?.title || service.federalServices?.title}</h3>
                      <ul className="space-y-3">
                        {(service.federalServices?.items || service.services?.items)?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* State Services */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.stateServices?.title}</h3>
                      <ul className="space-y-3">
                        {service.stateServices?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Local Services */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.localServices?.title}</h3>
                      <ul className="space-y-3">
                        {service.localServices?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.benefits?.title}</h3>
                      <ul className="space-y-3">
                        {service.benefits?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        WhatsApp Free Consult
                      </Link>
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        Email an Expert
                      </Link>
                    </div>
                  </>
                ) : service.id === "representation" || service.id === "planning" ? (
                  <>
                    {/* Services Section */}
                    {service.services?.items?.length? (
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.services?.title}</h3>
                        <ul className="space-y-3">
                          {(service.benefits?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="text-blue-600">•</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ):null}

                    {/* Process Section */}
                    {service.process?.items?.length? (
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.process?.title}</h3>
                        <ul className="space-y-3">
                          {(service.benefits?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="text-blue-600">•</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ):null}

                    {/* Benefits Section */}
                    {service.benefits?.items?.length? (
                      <div className="bg-white rounded-xl shadow-lg p-8">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">{service.benefits?.title}</h3>
                        <ul className="space-y-3">
                          {(service.benefits?.items || []).map((item, idx) => (
                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                              <div className="text-blue-600">•</div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ):null}


                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        WhatsApp Free Consult
                      </Link>
                     <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                         Email an Expert
                      </Link>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Services Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.services?.title}</h3>
                      <ul className="space-y-3">
                        {service.services?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Process Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.process?.title}</h3>
                      <ul className="space-y-3">
                        {service.process?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits Section */}
                    <div className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">{service.benefits?.title}</h3>
                      <ul className="space-y-3">
                        {service.benefits?.items?.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-gray-700">
                            <div className="text-blue-600">•</div>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="flex justify-center gap-4">
                      <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                        WhatsApp Free Consult
                      </Link>
                     <Link href="/contact" className="bg-[#006666] text-white px-6 py-3 rounded-lg hover:bg-[#087830] transition-all">
                         Email an Expert
                      </Link>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-green-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact us today for expert assistance with your individual tax needs
          </p>
          <Link
            href="/contact"
            className="bg-[#006666] text-white px-8 py-4 rounded-lg hover:bg-[#087830] transition-all inline-block"
          >
            Schedule a Consultation
          </Link>
        </div>
      </section>
    </>
  );
}
