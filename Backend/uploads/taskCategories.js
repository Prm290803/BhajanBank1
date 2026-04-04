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
  { name: "Brahma Muhurat Pooja (બ્રહ્મમુહૂર્ત પૂજા)", displayName: "Brahma Muhurat Pooja", points: 50, categoryType: "Bhajan" },
  { name: "Satsang Sabha (સત્સંગ સભા)", displayName: "Satsang Sabha", points: 15, categoryType: "Satsang" },
  { name: "Nitya Chesta (નિયમ-ચેષ્ટા)", displayName: "Nitya Chesta", points: 20, categoryType: "Bhajan" },
  { name: "Harismruti (હરિસ્મૃતિ)", displayName: "Harismruti", points: 10, categoryType: "Path" },
  { name: "Pradakshina (પ્રદક્ષિણા)", displayName: "Pradakshina", points: 5, categoryType: "Tap" },
  { name: "Janmangal Stotra / Namavali (જનમંગલ સ્તોત્ર / નામાવલિ)", displayName: "Janmangal Stotra / Namavali", points: 10, categoryType: "Path" },
  { name: "Janmangal Anusthan (જનમંગલ અનુષ્ઠાન)", displayName: "Janmangal Anusthan", points: 100, categoryType: "Tap" },
  { name: "Vandu Sahajanand (વંદુ સહજાનંદ)", displayName: "Vandu Sahajanand", points: 10, categoryType: "Path" },
  { name: "Parcha Prakaran (પરચા પ્રકરણ)", displayName: "Parcha Prakaran", points: 5, categoryType: "Path" },
  { name: "Vachnamrut Paarayan (વચનામૃત પારાયણ)", displayName: "Vachnamrut Paarayan", points: 50, categoryType: "Path" },
  { name: "Mala (માળા)", displayName: "Mala", points: 10.8, categoryType: "Tap" },
  { name: "Gurumantra Mala (ગુરુમંત્ર માળા)", displayName: "Gurumantra Mala", points: 10.5, categoryType: "Tap" },
  { name: "Hanuman Chalisa (હનુમાન ચાલીસા)", displayName: "Hanuman Chalisa", points: 5, categoryType: "Path" },
  { name: "Beej Mantra Japp (બીજ મંત્ર જપ)", displayName: "Beej Mantra Japp", points: 1, categoryType: "Bhajan" },
  { name: "Hanumanji Mantra Japp (હનુમાનજી મંત્ર જપ)", displayName: "Hanumanji Mantra Japp", points: 1, categoryType: "Bhajan" },
  { name: "Satsangi Jivan (સત્સંગી જીવન)", displayName: "Satsangi Jivan", points: 10, categoryType: "Path" },
  { name: "Shanti Path (શાંતિ પાઠ)", displayName: "Shanti Path", points: 10, categoryType: "Path" },
  { name: "Bal Sabha (બાળ સભા)", displayName: "Bal Sabha", points: 15, categoryType: "Satsang" },
  { name: "Yuva Sabha (યુવા સભા)", displayName: "Yuva Sabha", points: 15, categoryType: "Satsang" },
  { name: "Mahila Sabha (મહિલા સભા)", displayName: "Mahila Sabha", points: 15, categoryType: "Satsang" },
  { name: "Ravi Sabha (રવિ સભા)", displayName: "Ravi Sabha", points: 15, categoryType: "Satsang" },
  { name: "Shikshapatri Paarayan (શિક્ષાપત્રી પારાયણ)", displayName: "Shikshapatri Paarayan", points: 212, categoryType: "Path" },
  { name: "Pad Yatra (પદ યાત્રા)", displayName: "Pad Yatra", points: 10, categoryType: "Tap" },
  { name: "Satsang Vartalap (સત્સંગ વર્તાલાપ)", displayName: "Satsang Vartalap", points: 5, categoryType: "Satsang" },
 {name: "Dandwat Pranam (દંડવત પ્રણામ)", displayName: "Dandwat Pranam", points: 1, categoryType: "Tap"}
]

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
