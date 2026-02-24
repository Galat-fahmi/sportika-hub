import { motion } from "framer-motion";
import energyDrinksImage from "@/assets/energy-drinks.jpg";

const LineupImage = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-5xl mx-auto"
        >
          <div className="card-premium overflow-hidden group">
            <img
              src={energyDrinksImage}
              alt="Sportika Energy drink lineup featuring four bold flavors"
              className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LineupImage;
