import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const words = [
  // 水果 (15)
  { word: "apple", phonetic: "/ˈæp.əl/", meaning: "苹果", example: "I eat an apple every day.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "banana", phonetic: "/bəˈnæn.ə/", meaning: "香蕉", example: "Bananas are rich in potassium.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "orange", phonetic: "/ˈɒr.ɪndʒ/", meaning: "橙子", example: "She drank a glass of orange juice.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "grape", phonetic: "/ɡreɪp/", meaning: "葡萄", example: "These grapes are sweet.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "strawberry", phonetic: "/ˈstrɔː.bər.i/", meaning: "草莓", example: "I love strawberry ice cream.", category: "水果", difficulty: 1.5, level: 2 },
  { word: "watermelon", phonetic: "/ˈwɔː.tər.mel.ən/", meaning: "西瓜", example: "Watermelon is perfect for summer.", category: "水果", difficulty: 2.0, level: 2 },
  { word: "pineapple", phonetic: "/ˈpaɪn.æp.əl/", meaning: "菠萝", example: "Pineapple has a sweet and tangy taste.", category: "水果", difficulty: 1.5, level: 2 },
  { word: "mango", phonetic: "/ˈmæŋ.ɡoʊ/", meaning: "芒果", example: "Mango smoothie is delicious.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "peach", phonetic: "/piːtʃ/", meaning: "桃子", example: "The peach is soft and juicy.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "cherry", phonetic: "/ˈtʃer.i/", meaning: "樱桃", example: "Cherry blossoms bloom in spring.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "lemon", phonetic: "/ˈlem.ən/", meaning: "柠檬", example: "Add some lemon to your tea.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "blueberry", phonetic: "/ˈbluː.be.ri/", meaning: "蓝莓", example: "Blueberries are full of antioxidants.", category: "水果", difficulty: 1.5, level: 2 },
  { word: "kiwi", phonetic: "/ˈkiː.wiː/", meaning: "猕猴桃", example: "Kiwi fruit tastes sour and sweet.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "pear", phonetic: "/per/", meaning: "梨", example: "This pear is very crunchy.", category: "水果", difficulty: 1.0, level: 1 },
  { word: "coconut", phonetic: "/ˈkoʊ.kə.nʌt/", meaning: "椰子", example: "Coconut water is refreshing.", category: "水果", difficulty: 1.5, level: 2 },

  // 动物 (15)
  { word: "dog", phonetic: "/dɒɡ/", meaning: "狗", example: "My dog loves to play fetch.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "cat", phonetic: "/kæt/", meaning: "猫", example: "The cat is sleeping on the sofa.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "elephant", phonetic: "/ˈel.ɪ.fənt/", meaning: "大象", example: "Elephants are the largest land animals.", category: "动物", difficulty: 1.5, level: 2 },
  { word: "lion", phonetic: "/ˈlaɪ.ən/", meaning: "狮子", example: "The lion is the king of the jungle.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "tiger", phonetic: "/ˈtaɪ.ɡər/", meaning: "老虎", example: "Tigers have beautiful stripes.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "panda", phonetic: "/ˈpæn.də/", meaning: "熊猫", example: "Pandas eat bamboo all day.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "monkey", phonetic: "/ˈmʌŋ.ki/", meaning: "猴子", example: "Monkeys love to swing from trees.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "rabbit", phonetic: "/ˈræb.ɪt/", meaning: "兔子", example: "The rabbit hops quickly.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "bird", phonetic: "/bɜːrd/", meaning: "鸟", example: "Birds sing in the morning.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "fish", phonetic: "/fɪʃ/", meaning: "鱼", example: "Fish swim in the ocean.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "horse", phonetic: "/hɔːrs/", meaning: "马", example: "She goes horseback riding on weekends.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "bear", phonetic: "/ber/", meaning: "熊", example: "Bears hibernate in winter.", category: "动物", difficulty: 1.0, level: 1 },
  { word: "wolf", phonetic: "/wʊlf/", meaning: "狼", example: "Wolves hunt in packs.", category: "动物", difficulty: 1.5, level: 2 },
  { word: "deer", phonetic: "/dɪr/", meaning: "鹿", example: "Deer are gentle forest animals.", category: "动物", difficulty: 1.5, level: 2 },
  { word: "giraffe", phonetic: "/dʒəˈræf/", meaning: "长颈鹿", example: "Giraffes have very long necks.", category: "动物", difficulty: 1.5, level: 2 },

  // 颜色 (10)
  { word: "red", phonetic: "/red/", meaning: "红色", example: "She wore a red dress.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "blue", phonetic: "/bluː/", meaning: "蓝色", example: "The sky is blue today.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "green", phonetic: "/ɡriːn/", meaning: "绿色", example: "Grass is usually green.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "yellow", phonetic: "/ˈjel.oʊ/", meaning: "黄色", example: "Sunflowers are bright yellow.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "white", phonetic: "/waɪt/", meaning: "白色", example: "Snow is white in winter.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "black", phonetic: "/blæk/", meaning: "黑色", example: "He has black hair.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "purple", phonetic: "/ˈpɜːr.pəl/", meaning: "紫色", example: "Grapes can be purple.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "pink", phonetic: "/pɪŋk/", meaning: "粉色", example: "Cherry blossoms are pink.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "brown", phonetic: "/braʊn/", meaning: "棕色", example: "Dogs can be brown or black.", category: "颜色", difficulty: 1.0, level: 1 },
  { word: "gray", phonetic: "/ɡreɪ/", meaning: "灰色", example: "Clouds are often gray.", category: "颜色", difficulty: 1.0, level: 1 },

  // 数字 (10)
  { word: "one", phonetic: "/wʌn/", meaning: "一", example: "I have one brother.", category: "数字", difficulty: 1.0, level: 1 },
  { word: "two", phonetic: "/tuː/", meaning: "二", example: "There are two cats.", category: "数字", difficulty: 1.0, level: 1 },
  { word: "three", phonetic: "/θriː/", meaning: "三", example: "I need three eggs.", category: "数字", difficulty: 1.0, level: 1 },
  { word: "ten", phonetic: "/ten/", meaning: "十", example: "Ten minutes is enough.", category: "数字", difficulty: 1.0, level: 1 },
  { word: "hundred", phonetic: "/ˈhʌn.drəd/", meaning: "百", example: "There are a hundred seats.", category: "数字", difficulty: 1.5, level: 2 },
  { word: "thousand", phonetic: "/ˈθaʊ.zənd/", meaning: "千", example: "A thousand stars in the sky.", category: "数字", difficulty: 1.5, level: 2 },
  { word: "million", phonetic: "/ˈmɪl.jən/", meaning: "百万", example: "Millions of people use this app.", category: "数字", difficulty: 2.0, level: 3 },
  { word: "first", phonetic: "/fɜːrst/", meaning: "第一", example: "She finished first in the race.", category: "数字", difficulty: 1.5, level: 2 },
  { word: "second", phonetic: "/ˈsek.ənd/", meaning: "第二", example: "This is my second time here.", category: "数字", difficulty: 1.5, level: 2 },
  { word: "half", phonetic: "/hæf/", meaning: "一半", example: "I ate half the cake.", category: "数字", difficulty: 1.0, level: 1 },

  // 家庭 (10)
  { word: "mother", phonetic: "/ˈmʌð.ər/", meaning: "母亲", example: "My mother cooks dinner.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "father", phonetic: "/ˈfɑː.ðər/", meaning: "父亲", example: "My father works in an office.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "brother", phonetic: "/ˈbrʌð.ər/", meaning: "兄弟", example: "I have one brother.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "sister", phonetic: "/ˈsɪs.tər/", meaning: "姐妹", example: "My sister is older than me.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "family", phonetic: "/ˈfæm.əl.i/", meaning: "家庭", example: "Family is very important.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "parent", phonetic: "/ˈper.ənt/", meaning: "父母", example: "Both parents attended the meeting.", category: "家庭", difficulty: 1.5, level: 2 },
  { word: "grandparent", phonetic: "/ˈɡræn.per.ənt/", meaning: "祖父母", example: "Grandparents love their grandchildren.", category: "家庭", difficulty: 2.0, level: 3 },
  { word: "uncle", phonetic: "/ˈʌŋ.kəl/", meaning: "叔叔", example: "My uncle lives in Beijing.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "aunt", phonetic: "/ænt/", meaning: "阿姨", example: "My aunt baked a cake.", category: "家庭", difficulty: 1.0, level: 1 },
  { word: "child", phonetic: "/tʃaɪld/", meaning: "孩子", example: "The child is playing outside.", category: "家庭", difficulty: 1.0, level: 1 },

  // 食物 (20)
  { word: "rice", phonetic: "/raɪs/", meaning: "米饭", example: "We eat rice every day.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "bread", phonetic: "/bred/", meaning: "面包", example: "I had bread for breakfast.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "egg", phonetic: "/eɡ/", meaning: "鸡蛋", example: "Two eggs, please.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "meat", phonetic: "/miːt/", meaning: "肉", example: "I don't eat meat.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "chicken", phonetic: "/ˈtʃɪk.ɪn/", meaning: "鸡肉", example: "Chicken soup is healthy.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "beef", phonetic: "/biːf/", meaning: "牛肉", example: "Beef is high in protein.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "pork", phonetic: "/pɔːrk/", meaning: "猪肉", example: "Pork dumplings are delicious.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "noodle", phonetic: "/ˈnuː.dəl/", meaning: "面条", example: "I love noodle soup.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "soup", phonetic: "/suːp/", meaning: "汤", example: "Hot soup on a cold day.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "salad", phonetic: "/ˈsæl.əd/", meaning: "沙拉", example: "I'll have a Caesar salad.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "pizza", phonetic: "/ˈpiːt.sə/", meaning: "披萨", example: "Pizza is my favorite food.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "cake", phonetic: "/keɪk/", meaning: "蛋糕", example: "We celebrated with a cake.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "cookie", phonetic: "/ˈkʊk.i/", meaning: "饼干", example: "Fresh cookies smell amazing.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "cheese", phonetic: "/tʃiːz/", meaning: "奶酪", example: "Cheese comes from milk.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "milk", phonetic: "/mɪlk/", meaning: "牛奶", example: "Drink milk for strong bones.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "coffee", phonetic: "/ˈkɒf.i/", meaning: "咖啡", example: "I need coffee to wake up.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "tea", phonetic: "/tiː/", meaning: "茶", example: "Green tea is healthy.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "juice", phonetic: "/dʒuːs/", meaning: "果汁", example: "Orange juice is vitamin C rich.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "butter", phonetic: "/ˈbʌt.ər/", meaning: "黄油", example: "Spread butter on toast.", category: "食物", difficulty: 1.0, level: 1 },
  // 食物 (20)
  { word: "rice", phonetic: "/raɪs/", meaning: "米饭", example: "We eat rice every day.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "bread", phonetic: "/bred/", meaning: "面包", example: "I had bread for breakfast.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "egg", phonetic: "/eɡ/", meaning: "鸡蛋", example: "Two eggs, please.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "meat", phonetic: "/miːt/", meaning: "肉", example: "I don't eat meat.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "chicken", phonetic: "/ˈtʃɪk.ɪn/", meaning: "鸡肉", example: "Chicken soup is healthy.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "beef", phonetic: "/biːf/", meaning: "牛肉", example: "Beef is high in protein.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "pork", phonetic: "/pɔːrk/", meaning: "猪肉", example: "Pork dumplings are delicious.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "noodle", phonetic: "/ˈnuː.dəl/", meaning: "面条", example: "I love noodle soup.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "soup", phonetic: "/suːp/", meaning: "汤", example: "Hot soup on a cold day.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "salad", phonetic: "/ˈsæl.əd/", meaning: "沙拉", example: "I'll have a Caesar salad.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "pizza", phonetic: "/ˈpiːt.sə/", meaning: "披萨", example: "Pizza is my favorite food.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "cake", phonetic: "/keɪk/", meaning: "蛋糕", example: "We celebrated with a cake.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "cookie", phonetic: "/ˈkʊk.i/", meaning: "饼干", example: "Fresh cookies smell amazing.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "cheese", phonetic: "/tʃiːz/", meaning: "奶酪", example: "Cheese comes from milk.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "milk", phonetic: "/mɪlk/", meaning: "牛奶", example: "Drink milk for strong bones.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "coffee", phonetic: "/ˈkɒf.i/", meaning: "咖啡", example: "I need coffee to wake up.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "tea", phonetic: "/tiː/", meaning: "茶", example: "Green tea is healthy.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "juice", phonetic: "/dʒuːs/", meaning: "果汁", example: "Orange juice is vitamin C rich.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "butter", phonetic: "/ˈbʌt.ər/", meaning: "黄油", example: "Spread butter on toast.", category: "食物", difficulty: 1.0, level: 1 },
  { word: "sugar", phonetic: "/ˈʃʊɡ.ər/", meaning: "糖", example: "Too much sugar is bad.", category: "食物", difficulty: 1.0, level: 1 },

  // 通用 (20)
  { word: "hello", phonetic: "/həˈloʊ/", meaning: "你好", example: "Hello, how are you?", category: "通用", difficulty: 1.0, level: 1 },
  { word: "goodbye", phonetic: "/ɡʊdˈbaɪ/", meaning: "再见", example: "Goodbye, see you tomorrow!", category: "通用", difficulty: 1.0, level: 1 },
  { word: "thank", phonetic: "/θæŋk/", meaning: "谢谢", example: "Thank you for your help.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "please", phonetic: "/pliːz/", meaning: "请", example: "Please sit down.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "sorry", phonetic: "/ˈsɒr.i/", meaning: "对不起", example: "Sorry, I'm late.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "yes", phonetic: "/jes/", meaning: "是的", example: "Yes, I agree.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "no", phonetic: "/noʊ/", meaning: "不", example: "No, thank you.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "water", phonetic: "/ˈwɔː.t̬ər/", meaning: "水", example: "I need some water.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "house", phonetic: "/haʊs/", meaning: "房子", example: "This is my house.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "school", phonetic: "/skuːl/", meaning: "学校", example: "I go to school every day.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "book", phonetic: "/bʊk/", meaning: "书", example: "I'm reading a book.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "pen", phonetic: "/pen/", meaning: "钢笔", example: "Can I borrow your pen?", category: "通用", difficulty: 1.0, level: 1 },
  { word: "phone", phonetic: "/foʊn/", meaning: "手机", example: "My phone is ringing.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "computer", phonetic: "/kəmˈpjuː.t̬ɚ/", meaning: "电脑", example: "I use a computer for work.", category: "通用", difficulty: 1.5, level: 2 },
  { word: "city", phonetic: "/ˈsɪt.i/", meaning: "城市", example: "Beijing is a big city.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "road", phonetic: "/roʊd/", meaning: "道路", example: "The road is very long.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "time", phonetic: "/taɪm/", meaning: "时间", example: "What time is it?", category: "通用", difficulty: 1.0, level: 1 },
  { word: "day", phonetic: "/deɪ/", meaning: "天", example: "Have a nice day!", category: "通用", difficulty: 1.0, level: 1 },
  { word: "night", phonetic: "/naɪt/", meaning: "夜晚", example: "Good night, sleep well.", category: "通用", difficulty: 1.0, level: 1 },
  { word: "friend", phonetic: "/frend/", meaning: "朋友", example: "She is my best friend.", category: "通用", difficulty: 1.0, level: 1 },
];

async function main() {
  console.log("🌱 Seeding database with 100 words...");

  // Create default user
  const user = await prisma.user.upsert({
    where: { username: "demo_user" },
    update: {},
    create: {
      username: "demo_user",
      email: "demo@wordgo.app",
      totalXP: 0,
      streak: 0,
      level: 1,
    },
  });
  console.log(`✅ Default user created: ${user.username}`);

  // Create words
  for (const w of words) {
    await prisma.word.upsert({
      where: { word: w.word },
      update: {},
      create: {
        word: w.word,
        phonetic: w.phonetic,
        meaning: w.meaning,
        example: w.example,
        category: w.category,
        difficulty: w.difficulty,
        level: w.level,
      },
    });
  }
  console.log(`✅ ${words.length} words seeded`);

  // Create initial progress for all words
  const existingProgress = await prisma.wordProgress.findMany({ where: { userId: user.id } });
  const existingWordIds = new Set(existingProgress.map(p => p.wordId));

  for (const w of words) {
    const word = await prisma.word.findUnique({ where: { word: w.word } });
    if (!word || existingWordIds.has(word.id)) continue;
    await prisma.wordProgress.create({
      data: {
        userId: user.id,
        wordId: word.id,
        correct: 0,
        wrong: 0,
        mastery: 0,
        reviewCount: 0,
      },
    });
  }
  console.log("✅ Word progress records created for all words");

  console.log("🎉 Database seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
