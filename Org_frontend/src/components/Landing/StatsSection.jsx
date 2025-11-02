import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Users, Award, Clock } from 'lucide-react';

const StatsSection = () => {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Active Students",
      color: "from-cyan-400 to-cyan-600"
    },
    {
      icon: Award,
      number: "500+",
      label: "DSA Problems",
      color: "from-blue-400 to-blue-600"
    },
    {
      icon: TrendingUp,
      number: "95%",
      label: "Success Rate",
      color: "from-cyan-300 to-blue-500"
    },
    {
      icon: Clock,
      number: "24/7",
      label: "Available Support",
      color: "from-blue-300 to-cyan-500"
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Trusted by Thousands
          </h2>
          <p className="text-lg text-gray-300">
            Join our growing community of successful developers
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                className="text-center group"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.1,
                  type: "spring",
                  damping: 15
                }}
              >
                <motion.div
                  className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center group-hover:shadow-lg group-hover:shadow-cyan-400/20 transition-all duration-300`}
                  whileHover={{ 
                    scale: 1.15, 
                    rotate: 10,
                    y: -5
                  }}
                  transition={{ type: "spring", damping: 10 }}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>
                <motion.div
                  className="text-4xl font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  {stat.number}
                </motion.div>
                <div className="text-gray-300 group-hover:text-gray-200 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;