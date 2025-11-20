// 'use client';

// import Image from 'next/image';
// import { motion } from 'framer-motion';
// import { FaHandshake, FaBalanceScale, FaLock, FaChartLine } from 'react-icons/fa';

// export default function About() {
//   return (
//     <>
//       {/* Hero Section */}
//       <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-24 overflow-hidden">
//         <div className="absolute inset-0 bg-[url('/team.svg')] opacity-5"></div>
//         <div className="container mx-auto px-4">
//           <motion.div 
//             initial={{ opacity: 0, y: 30 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.7, ease: "easeOut" }}
//             className="max-w-4xl mx-auto text-center relative z-10"
//           >
//             <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-8 leading-tight">
//               About Cognitax LLC
//             </h1>
//             <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto">
//               We're dedicated to making tax filing simple, secure, and stress-free for individuals and businesses, with a commitment to excellence and innovation.
//             </p>
//           </motion.div>
//         </div>
//       </section>

//       {/* Mission Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
//             <motion.div 
//               initial={{ opacity: 0, x: -30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7 }}
//               className="lg:w-1/2"
//             >
//               <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8">Our Mission</h2>
//               <div className="space-y-6 text-lg">
//                 <p className="text-gray-600">
//                   At Cognitax LLC, our mission is to provide expert tax preparation and financial advisory services that empower our clients to achieve financial success while ensuring full compliance with tax regulations.
//                 </p>
//                 <p className="text-gray-600">
//                   We believe that everyone deserves access to professional tax services that maximize their financial benefits while minimizing stress and complexity. Our team of certified tax professionals is committed to staying at the forefront of tax law changes to provide the most accurate and beneficial service to our clients.
//                 </p>
//                 <p className="text-gray-600">
//                   Whether you're an individual, small business owner, or corporation, we're here to guide you through the complexities of tax filing with personalized attention and expert advice.
//                 </p>
//               </div>
//             </motion.div>
//             <motion.div 
//               initial={{ opacity: 0, x: 30 }}
//               whileInView={{ opacity: 1, x: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.7 }}
//               className="lg:w-1/2"
//             >
//               <div className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
//                 <Image 
//                   src="/team.svg" 
//                   alt="Cognitax team" 
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   className="filter brightness-105"
//                 />
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Values Section */}
//       <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
//         <div className="container mx-auto px-4">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Our Core Values</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               These principles guide everything we do at Cognitax, ensuring excellence in service and client satisfaction.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center group"
//             >
//               <div className="text-blue-600 mb-6 flex justify-center">
//                 <FaHandshake size={48} className="transform group-hover:scale-110 transition-transform duration-300" />
//               </div>
//               <h3 className="text-2xl font-bold mb-4 text-gray-800">Integrity</h3>
//               <p className="text-gray-600 leading-relaxed">
//                 We uphold the highest ethical standards in all our client interactions and tax practices.
//               </p>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center group"
//             >
//               <div className="text-blue-600 mb-6 flex justify-center">
//                 <FaBalanceScale size={48} className="transform group-hover:scale-110 transition-transform duration-300" />
//               </div>
//               <h3 className="text-2xl font-bold mb-4 text-gray-800">Accuracy</h3>
//               <p className="text-gray-600 leading-relaxed">
//                 We are meticulous in our work, ensuring precise calculations and adherence to tax regulations.
//               </p>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center group"
//             >
//               <div className="text-blue-600 mb-6 flex justify-center">
//                 <FaLock size={48} className="transform group-hover:scale-110 transition-transform duration-300" />
//               </div>
//               <h3 className="text-2xl font-bold mb-4 text-gray-800">Confidentiality</h3>
//               <p className="text-gray-600 leading-relaxed">
//                 We protect your financial information with the highest level of security and privacy.
//               </p>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.4 }}
//               className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-center group"
//             >
//               <div className="text-blue-600 mb-6 flex justify-center">
//                 <FaChartLine size={48} className="transform group-hover:scale-110 transition-transform duration-300" />
//               </div>
//               <h3 className="text-2xl font-bold mb-4 text-gray-800">Innovation</h3>
//               <p className="text-gray-600 leading-relaxed">
//                 We continuously improve our processes and stay updated with the latest tax strategies.
//               </p>
//             </motion.div>
//           </div>
//         </div>
//       </section>

//       {/* Team Section */}
//       <section className="py-20">
//         <div className="container mx-auto px-4">
//           <motion.div 
//             initial={{ opacity: 0, y: 20 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.5 }}
//             className="text-center mb-16"
//           >
//             <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Our Expert Team</h2>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto">
//               Meet our team of certified tax professionals dedicated to serving your financial needs with expertise and care.
//             </p>
//           </motion.div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.1 }}
//               className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               <div className="relative h-72 w-full">
//                 <Image 
//                   src="/team-member-1.svg" 
//                   alt="Sarah Johnson - Chief Tax Strategist" 
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   className="transform hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold mb-2 text-gray-800">Sarah Johnson</h3>
//                 <p className="text-blue-600 text-lg mb-4">Chief Tax Strategist</p>
//                 <p className="text-gray-600 leading-relaxed">
//                   With over 15 years of experience in tax preparation and financial planning, Sarah leads our team with expertise and dedication.
//                 </p>
//               </div>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.2 }}
//               className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               <div className="relative h-72 w-full">
//                 <Image 
//                   src="/team-member-2.svg" 
//                   alt="Michael Chen - Business Tax Specialist" 
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   className="transform hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold mb-2 text-gray-800">Michael Chen</h3>
//                 <p className="text-blue-600 text-lg mb-4">Business Tax Specialist</p>
//                 <p className="text-gray-600 leading-relaxed">
//                   Michael specializes in business taxation, helping small businesses and corporations optimize their tax strategies.
//                 </p>
//               </div>
//             </motion.div>

//             <motion.div 
//               initial={{ opacity: 0, y: 20 }}
//               whileInView={{ opacity: 1, y: 0 }}
//               viewport={{ once: true }}
//               transition={{ duration: 0.5, delay: 0.3 }}
//               className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
//             >
//               <div className="relative h-72 w-full">
//                 <Image 
//                   src="/team-member-3.svg" 
//                   alt="Lisa Rodriguez - Personal Tax Advisor" 
//                   fill
//                   style={{ objectFit: 'cover' }}
//                   className="transform hover:scale-105 transition-transform duration-300"
//                 />
//               </div>
//               <div className="p-8">
//                 <h3 className="text-2xl font-bold mb-2 text-gray-800">Lisa Rodriguez</h3>
//                 <p className="text-blue-600 text-lg mb-4">Personal Tax Advisor</p>
//                 <p className="text-gray-600 leading-relaxed">
//                   Lisa is passionate about helping individuals navigate personal tax challenges and maximize their returns.
//                 </p>
//               </div>
//             </motion.div>
//           </div>
//         </div>
//       </section>
//     </>
//   );
// }

'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaHandshake, FaBalanceScale, FaLock, FaChartLine } from 'react-icons/fa';

export default function About() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 to-blue-700 text-white py-28 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/team.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            About Cognitax
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto"
          >
            Simplifying tax filing with precision, security, and a commitment to excellence. We guide individuals and businesses to maximize benefits while minimizing stress.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8">Our Mission</h2>
              <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>
                  Empowering clients with expert tax preparation and financial guidance to achieve success while ensuring compliance and peace of mind.
                </p>
                <p>
                  Everyone deserves professional support to maximize financial benefits. Our certified experts stay updated with the latest tax laws to provide accurate and beneficial advice.
                </p>
                <p>
                  Individuals, small businesses, or corporations—our team ensures personalized guidance through the complexities of tax filing.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:w-1/2"
            >
              <div className="relative h-96 w-full rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transform hover:scale-[1.02] transition-transform duration-300">
                <Image
                  src="/team.svg"
                  alt="Cognitax Team"
                  fill
                  style={{ objectFit: 'cover' }}
                  className="filter brightness-105"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="py-28 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">Our Core Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Guiding principles that define our work ethic and client commitment.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16">
            {[
              {
                title: "Integrity",
                desc: "Upholding the highest ethical standards in all our client interactions and tax practices.",
                icon: <FaHandshake size={48} />,
                color: "bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600"
              },
              {
                title: "Accuracy",
                desc: "Meticulous in work, ensuring precise calculations and adherence to tax regulations.",
                icon: <FaBalanceScale size={48} />,
                color: "bg-gradient-to-br from-green-100 to-green-200 text-green-600"
              },
              {
                title: "Confidentiality",
                desc: "Protecting your financial information with the highest level of security and privacy.",
                icon: <FaLock size={48} />,
                color: "bg-gradient-to-br from-yellow-100 to-yellow-200 text-yellow-600"
              },
              {
                title: "Innovation",
                desc: "Continuously improving processes and staying updated with the latest tax strategies.",
                icon: <FaChartLine size={48} />,
                color: "bg-gradient-to-br from-red-100 to-red-200 text-red-600"
              }
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-white p-10 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 text-center group transition-all duration-300"
              >
                <div className={`${value.color} p-6 rounded-full mx-auto mb-6 inline-flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                  {value.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-gray-800 group-hover:text-blue-600 transition-colors duration-300">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-28 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-6">Our Expert Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet our certified tax professionals dedicated to delivering expert financial services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                name: "Sarah Johnson",
                role: "Chief Tax Strategist",
                img: "/team-member-1.svg",
                desc: "With over 15 years of experience in tax preparation and financial planning, Sarah leads our team with expertise and dedication."
              },
              {
                name: "Michael Chen",
                role: "Business Tax Specialist",
                img: "/team-member-2.svg",
                desc: "Michael specializes in business taxation, helping small businesses and corporations optimize their tax strategies."
              },
              {
                name: "Lisa Rodriguez",
                role: "Personal Tax Advisor",
                img: "/team-member-3.svg",
                desc: "Lisa is passionate about helping individuals navigate personal tax challenges and maximize their returns."
              }
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-80 w-full">
                  <Image
                    src={member.img}
                    alt={`${member.name} - ${member.role}`}
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transform hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2 text-gray-800">{member.name}</h3>
                  <p className="text-blue-600 text-lg mb-4">{member.role}</p>
                  <p className="text-gray-600 leading-relaxed">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
