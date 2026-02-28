// seed/taskCategories.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import TaskCategory from "../models/TaskCategory.js";

dotenv.config();

const seedTaskCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("📡 Connected to MongoDB");

    const categories = [
      { name: "Mantra Japp (મંત્ર જપ)", displayName: "Mantra Japp", points: 0.1, categoryType: "Bhajan" },
      { name: "Anushthan of Beejmantra (બીજમંત્ર અનુષ્ઠાન)", displayName: "Anushthan of Beejmantra", points: 100, categoryType: "Tap" },
      { name: "Vachnamrut (વચનામૃત)", displayName: "Vachnamrut", points: 10, categoryType: "Path" },
      { name: "BhaktChintamani (ભક્તચિંતામણિ)", displayName: "BhaktChintamani", points: 10, categoryType: "Path" },
      { name: "Kirtan Bhajan (કીર્તન ભજન)", displayName: "Kirtan Bhajan", points: 5, categoryType: "Bhajan" },
      { name: "Bhram-Mohurat-Pooja (બ્રહ્મમુહૂર્ત પૂજા)", displayName: "Bhram-Mohurat-Pooja", points: 50, categoryType: "Bhajan" },
      { name: "Satsang Sabha (સત્સંગ સભા)", displayName: "Satsang Sabha", points: 15, categoryType: "Satsang" },
     
      { name: "Nitya Chesta (નિયમ-ચેષ્ટા)", displayName: "Nitya Chesta", points: 20, categoryType: "Bhajan" },
     
      { name: "Harismruti (હરિસ્મૃતિ)", displayName: "Harismruti", points: 10, categoryType: "Path" },
     
      { name: "Pradakshina (પ્રદક્ષિણા)", displayName: "Pradakshina", points: 5, categoryType: "Tap" },
     
      { name: "Janmangal Stotra/Namavali (જનમંગલ સ્તોત્ર/નામાવલિ)", displayName: "Janmangal Stotra/Namavali", points: 10, categoryType: "Path" },
     
      { name: "Sikshapatri Parayan (સિક્ષાપત્રિ પરાયણ)", displayName: "Sikshapatri Parayan", points: 212, categoryType: "Tap" },
     
      { name: "Vandu Sahajanand (વંદુ સહજાનંદ)", displayName: "Vandu Sahajanand", points: 10, categoryType: "Path" },
     
      { name: "Parcha-Prakrn (પરચા-પ્રકરણ)", displayName: "Parcha-Prakrn", points: 5, categoryType: "Path" },
     
      { name: "Vachnamrut Parayan (વચનામૃત પરાયણ)", displayName: "Vachnamrut Parayan", points: 50, categoryType: "Tap" },
     
      { name: "Mala (માળા)", displayName: "Mala", points: 10.8, categoryType: "Tap" },
     
      { name: "Gurumantra mala (ગુરુમંત્ર mala)", displayName: "Gurumantra mala", points: 10.5, categoryType: "Tap" },

      { name: "Hanuman Chalisha (હનુમાનચલિશા)", displayName: "Hanuman Chalisha", points: 5, categoryType: "Bhajan" },
    ];

    // Optional: clean existing collection before inserting
    await TaskCategory.deleteMany({});
    console.log("🧹 Old categories removed");

    await TaskCategory.insertMany(categories);
    console.log("✅ Task categories loaded successfully!");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding categories:", err);
    process.exit(1);
  }
};

seedTaskCategories();
