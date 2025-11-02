import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Users, Trophy, Target, BookOpen } from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      icon: Code,
      title: "500+ Problems",
      description: "Comprehensive collection of DSA problems from easy to advanced level"
    },
    {
      icon: Zap,
      title: "Real-time Feedback",
      description: "Get instant feedback on your solutions with detailed explanations"
    },
    {
      icon: Users,
      title: "Community Support",
      description: "Learn with thousands of students and get help when you need it"
    },
    {
      icon: Trophy,
      title: "Contests & Challenges",
      description: "Participate in weekly contests and challenge yourself"
    },
    {
      icon: Target,
      title: "Interview Prep",
      description: "Curated problems from top tech companies for interview preparation"
    },
    {
      icon: BookOpen,
      title: "Learning Paths",
      description: "Structured learning paths to guide your DSA journey"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Everything You Need to Excel
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Our platform provides all the tools and resources you need to master DSA
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                className="group bg-black/20 backdrop-blur-lg border border-cyan-400/10 rounded-xl p-6 hover:bg-black/30 hover:border-cyan-400/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <motion.div 
                  className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-300"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-cyan-100 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;