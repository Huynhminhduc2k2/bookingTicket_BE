import Redis from 'ioredis';
import config from './config';
// // Thông tin kết nối Redis
// const redisOptions: RedisOptions = {
//     host: 'localhost', // Địa chỉ Redis server
//     port: 6379,        // Cổng Redis mặc định
// };

// Tạo một client Redis
const client = new Redis(config.redis.url);

// Đóng kết nối Redis khi không sử dụng nữa
// client.quit();
export default client;