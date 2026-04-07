import { MongoClient, ServerApiVersion } from "mongodb";

// 尝试多种连接方式
const getConnectionUri = () => {
  // 优先使用环境变量
  if (process.env.MONGODB_URI) {
    return process.env.MONGODB_URI;
  }
  
  // 备用：使用标准连接格式（避免 SRV 解析问题）
  const username = '3458808512_db_user';
  const password = 'q1KvhUKWbOSV4vea';
  const cluster = 'cluster0.uplzu2p.mongodb.net';
  
  // 使用 mongodb:// 而不是 mongodb+srv://
  return `mongodb://${username}:${password}@${cluster}:27017/theme_factory?ssl=true&authSource=admin&retryWrites=true&w=majority`;
};

const uri = getConnectionUri();

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 30000,
  socketTimeoutMS: 45000,
});

let isConnected = false;

export async function connectToDatabase() {
  if (!isConnected) {
    try {
      console.log("Connecting to MongoDB...");
      await client.connect();
      isConnected = true;
      console.log("MongoDB connected successfully!");
    } catch (error: any) {
      console.error("MongoDB connection error:", error.message);
      throw new Error(`数据库连接失败: ${error.message}`);
    }
  }
  return client.db("theme_factory");
}

export { client };
