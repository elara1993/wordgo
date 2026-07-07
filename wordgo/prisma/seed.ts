import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const words = [
  // ===== FRUIT (15) =====
  { word: 'apple', phonetic: '/ˈæp.əl/', meaning: '苹果', category: 'fruit', difficulty: 'easy', level: 1 },
  { word: 'banana', phonetic: '/bəˈnæn.ə/', meaning: '香蕉', category: 'fruit', difficulty: 'easy', level: 1 },
  { word: 'grape', phonetic: '/ɡreɪp/', meaning: '葡萄', category: 'fruit', difficulty: 'easy', level: 1 },
  { word: 'strawberry', phonetic: '/ˈstrɔː.bər.i/', meaning: '草莓', category: 'fruit', difficulty: 'medium', level: 3 },
  { word: 'watermelon', phonetic: '/ˈwɔː.tər.mel.ən/', meaning: '西瓜', category: 'fruit', difficulty: 'medium', level: 3 },
  { word: 'pineapple', phonetic: '/ˈpaɪn.æp.əl/', meaning: '菠萝', category: 'fruit', difficulty: 'medium', level: 3 },
  { word: 'mango', phonetic: '/ˈmæŋ.ɡoʊ/', meaning: '芒果', category: 'fruit', difficulty: 'easy', level: 2 },
  { word: 'peach', phonetic: '/piːtʃ/', meaning: '桃子', category: 'fruit', difficulty: 'easy', level: 1 },
  { word: 'pear', phonetic: '/per/', meaning: '梨', category: 'fruit', difficulty: 'easy', level: 1 },
  { word: 'lemon', phonetic: '/ˈlem.ən/', meaning: '柠檬', category: 'fruit', difficulty: 'easy', level: 2 },
  { word: 'cherry', phonetic: '/ˈtʃer.i/', meaning: '樱桃', category: 'fruit', difficulty: 'easy', level: 2 },
  { word: 'blueberry', phonetic: '/ˈbluː.be.ri/', meaning: '蓝莓', category: 'fruit', difficulty: 'medium', level: 3 },
  { word: 'coconut', phonetic: '/ˈkoʊ.kə.nʌt/', meaning: '椰子', category: 'fruit', difficulty: 'medium', level: 2 },
  { word: 'avocado', phonetic: '/ˌæv.əˈkɑː.doʊ/', meaning: '牛油果', category: 'fruit', difficulty: 'hard', level: 5 },
  { word: 'apricot', phonetic: '/əˈprɒt/', meaning: '杏子', category: 'fruit', difficulty: 'hard', level: 5 },

  // ===== ANIMAL (15) =====
  { word: 'dog', phonetic: '/dɔːɡ/', meaning: '狗', category: 'animal', difficulty: 'easy', level: 1 },
  { word: 'cat', phonetic: '/kæt/', meaning: '猫', category: 'animal', difficulty: 'easy', level: 1 },
  { word: 'elephant', phonetic: '/ˈel.ɪ.fənt/', meaning: '大象', category: 'animal', difficulty: 'medium', level: 3 },
  { word: 'tiger', phonetic: '/ˈtaɪ.ɡər/', meaning: '老虎', category: 'animal', difficulty: 'easy', level: 2 },
  { word: 'lion', phonetic: '/ˈlaɪ.ən/', meaning: '狮子', category: 'animal', difficulty: 'easy', level: 2 },
  { word: 'bear', phonetic: '/ber/', meaning: '熊', category: 'animal', difficulty: 'easy', level: 1 },
  { word: 'rabbit', phonetic: '/ˈræb.ɪt/', meaning: '兔子', category: 'animal', difficulty: 'easy', level: 2 },
  { word: 'monkey', phonetic: '/ˈmʌŋ.ki/', meaning: '猴子', category: 'animal', difficulty: 'easy', level: 2 },
  { word: 'penguin', phonetic: '/ˈpeŋ.ɡwɪn/', meaning: '企鹅', category: 'animal', difficulty: 'medium', level: 3 },
  { word: 'giraffe', phonetic: '/dʒəˈræf/', meaning: '长颈鹿', category: 'animal', difficulty: 'medium', level: 3 },
  { word: 'dolphin', phonetic: '/ˈdɒl.fɪn/', meaning: '海豚', category: 'animal', difficulty: 'medium', level: 3 },
  { word: 'butterfly', phonetic: '/ˈbʌt.ər.flaɪ/', meaning: '蝴蝶', category: 'animal', difficulty: 'medium', level: 4 },
  { word: 'squirrel', phonetic: '/ˈskwɜːr.əl/', meaning: '松鼠', category: 'animal', difficulty: 'hard', level: 4 },
  { word: 'kangaroo', phonetic: '/ˌkæŋ.ɡəˈruː/', meaning: '袋鼠', category: 'animal', difficulty: 'hard', level: 4 },
  { word: 'panda', phonetic: '/ˈpæn.də/', meaning: '熊猫', category: 'animal', difficulty: 'easy', level: 1 },

  // ===== COLOR (10) =====
  { word: 'crimson', phonetic: '/ˈkrɪm.zən/', meaning: '深红色', category: 'color', difficulty: 'hard', level: 5 },
  { word: 'turquoise', phonetic: '/ˈtɜːr.kwɔːz/', meaning: '绿松石色', category: 'color', difficulty: 'hard', level: 5 },
  { word: 'magenta', phonetic: '/məˈdzen.tə/', meaning: '品红色', category: 'color', difficulty: 'hard', level: 5 },
  { word: 'lavender', phonetic: '/ˈlæv.ən.dər/', meaning: '淡紫色', category: 'color', difficulty: 'medium', level: 4 },
  { word: 'coral', phonetic: '/ˈkɔːr.əl/', meaning: '珊瑚色', category: 'color', difficulty: 'medium', level: 3 },
  { word: 'olive', phonetic: '/ˈɒl.ɪv/', meaning: '橄榄绿', category: 'color', difficulty: 'medium', level: 3 },
  { word: 'maroon', phonetic: '/məˈruːn/', meaning: '栗色', category: 'color', difficulty: 'medium', level: 3 },
  { word: 'beige', phonetic: '/beɪʒ/', meaning: '米色', category: 'color', difficulty: 'medium', level: 3 },
  { word: 'ivory', phonetic: '/ˈaɪ.vər.i/', meaning: '象牙白', category: 'color', difficulty: 'medium', level: 4 },
  { word: 'gold', phonetic: '/ɡoʊld/', meaning: '金色', category: 'color', difficulty: 'easy', level: 2 },

  // ===== NUMBER (10) =====
  { word: 'first', phonetic: '/fɜːrst/', meaning: '第一', category: 'number', difficulty: 'easy', level: 2 },
  { word: 'second', phonetic: '/ˈsek.ənd/', meaning: '第二', category: 'number', difficulty: 'easy', level: 2 },
  { word: 'third', phonetic: '/θɜːrd/', meaning: '第三', category: 'number', difficulty: 'easy', level: 2 },
  { word: 'hundred', phonetic: '/ˈhʌn.drəd/', meaning: '百', category: 'number', difficulty: 'easy', level: 2 },
  { word: 'thousand', phonetic: '/ˈθaʊ.zənd/', meaning: '千', category: 'number', difficulty: 'easy', level: 2 },
  { word: 'million', phonetic: '/ˈmɪl.jən/', meaning: '百万', category: 'number', difficulty: 'medium', level: 3 },
  { word: 'billion', phonetic: '/ˈbɪl.jən/', meaning: '十亿', category: 'number', difficulty: 'medium', level: 3 },
  { word: 'half', phonetic: '/hæf/', meaning: '一半', category: 'number', difficulty: 'easy', level: 1 },
  { word: 'quarter', phonetic: '/ˈkwɔːr.t̬ɚ/', meaning: '四分之一', category: 'number', difficulty: 'medium', level: 3 },
  { word: 'double', phonetic: '/ˈdʌb.əl/', meaning: '双倍', category: 'number', difficulty: 'easy', level: 2 },

  // ===== FAMILY (10) =====
  { word: 'parent', phonetic: '/ˈper.ənt/', meaning: '父母', category: 'family', difficulty: 'easy', level: 2 },
  { word: 'son', phonetic: '/sʌn/', meaning: '儿子', category: 'family', difficulty: 'easy', level: 1 },
  { word: 'daughter', phonetic: '/ˈdɔːt̬.ər/', meaning: '女儿', category: 'family', difficulty: 'easy', level: 1 },
  { word: 'husband', phonetic: '/ˈhʌz.bənd/', meaning: '丈夫', category: 'family', difficulty: 'easy', level: 2 },
  { word: 'wife', phonetic: '/waɪf/', meaning: '妻子', category: 'family', difficulty: 'easy', level: 1 },
  { word: 'grandparent', phonetic: '/ˈɡræn.per.ənt/', meaning: '祖父母', category: 'family', difficulty: 'medium', level: 3 },
  { word: 'grandson', phonetic: '/ˈɡræn.sʌn/', meaning: '孙子', category: 'family', difficulty: 'medium', level: 3 },
  { word: 'granddaughter', phonetic: '/ˌɡrænˈdɔːt̬.ər/', meaning: '孙女', category: 'family', difficulty: 'hard', level: 4 },
  { word: 'stepfather', phonetic: '/ˈstep.fɑː.ðər/', meaning: '继父', category: 'family', difficulty: 'hard', level: 4 },
  { word: 'inlaw', phonetic: '/ˈɪnˌlɔː/', meaning: '姻亲', category: 'family', difficulty: 'hard', level: 5 },

  // ===== FOOD (20) =====
  { word: 'noodle', phonetic: '/ˈnuː.dəl/', meaning: '面条', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'soup', phonetic: '/suːp/', meaning: '汤', category: 'food', difficulty: 'easy', level: 1 },
  { word: 'salad', phonetic: '/ˈsæl.əd/', meaning: '沙拉', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'pizza', phonetic: '/ˈpiːt.sə/', meaning: '披萨', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'burger', phonetic: '/ˈbɜːr.ɡər/', meaning: '汉堡', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'cake', phonetic: '/keɪk/', meaning: '蛋糕', category: 'food', difficulty: 'easy', level: 1 },
  { word: 'cookie', phonetic: '/ˈkʊk.i/', meaning: '饼干', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'cheese', phonetic: '/tʃiːz/', meaning: '奶酪', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'butter', phonetic: '/ˈbʌt.ər/', meaning: '黄油', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'coffee', phonetic: '/ˈkɒf.i/', meaning: '咖啡', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'juice', phonetic: '/dʒuːs/', meaning: '果汁', category: 'food', difficulty: 'easy', level: 1 },
  { word: 'pasta', phonetic: '/ˈpæs.tə/', meaning: '意大利面', category: 'food', difficulty: 'medium', level: 3 },
  { word: 'steak', phonetic: '/steɪk/', meaning: '牛排', category: 'food', difficulty: 'medium', level: 3 },
  { word: 'pancake', phonetic: '/ˈpæn.keɪk/', meaning: '煎饼', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'sandwich', phonetic: '/ˈsæn.wɪtʃ/', meaning: '三明治', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'chocolate', phonetic: '/ˈtʃɒk.lət/', meaning: '巧克力', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'candy', phonetic: '/ˈkæn.di/', meaning: '糖果', category: 'food', difficulty: 'easy', level: 1 },
  { word: 'honey', phonetic: '/ˈhʌn.i/', meaning: '蜂蜜', category: 'food', difficulty: 'easy', level: 2 },
  { word: 'salt', phonetic: '/sɔːlt/', meaning: '盐', category: 'food', difficulty: 'easy', level: 1 },
  { word: 'pepper', phonetic: '/ˈpep.ər/', meaning: '胡椒', category: 'food', difficulty: 'easy', level: 2 },

  // ===== GENERAL (20) =====
  { word: 'time', phonetic: '/taɪm/', meaning: '时间', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'day', phonetic: '/deɪ/', meaning: '天', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'night', phonetic: '/naɪt/', meaning: '夜晚', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'music', phonetic: '/ˈmjuː.zɪk/', meaning: '音乐', category: 'general', difficulty: 'easy', level: 2 },
  { word: 'happy', phonetic: '/ˈhæp.i/', meaning: '快乐的', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'beautiful', phonetic: '/ˈbjuː.tɪ.fəl/', meaning: '美丽的', category: 'general', difficulty: 'medium', level: 3 },
  { word: 'important', phonetic: '/ɪmˈpɔːr.tənt/', meaning: '重要的', category: 'general', difficulty: 'medium', level: 3 },
  { word: 'different', phonetic: '/ˈdɪf.ər.ənt/', meaning: '不同的', category: 'general', difficulty: 'medium', level: 3 },
  { word: 'weather', phonetic: '/ˈweð.ər/', meaning: '天气', category: 'general', difficulty: 'easy', level: 2 },
  { word: 'work', phonetic: '/wɜːrk/', meaning: '工作', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'money', phonetic: '/ˈmʌn.i/', meaning: '钱', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'city', phonetic: '/ˈsɪt.i/', meaning: '城市', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'country', phonetic: '/ˈkʌn.tri/', meaning: '国家', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'love', phonetic: '/lʌv/', meaning: '爱', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'book', phonetic: '/bʊk/', meaning: '书', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'water', phonetic: '/ˈwɔː.tər/', meaning: '水', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'friend', phonetic: '/frend/', meaning: '朋友', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'school', phonetic: '/skuːl/', meaning: '学校', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'house', phonetic: '/haʊs/', meaning: '房子', category: 'general', difficulty: 'easy', level: 1 },
  { word: 'dream', phonetic: '/driːm/', meaning: '梦想', category: 'general', difficulty: 'easy', level: 2 },
];

const exampleSentences: Record<string, string> = {
  apple: 'I eat an apple every day for a healthy lifestyle.',
  banana: 'Bananas are rich in potassium and very delicious.',
  grape: 'She picked some purple grapes from the vine.',
  strawberry: 'Strawberries with cream are my favorite dessert.',
  watermelon: 'Watermelon is the perfect summer fruit.',
  pineapple: 'Pineapple goes great on pizza.',
  mango: 'Mango smoothies are so refreshing.',
  peach: 'The ripe peach is soft and sweet.',
  pear: 'I bought a bag of pears at the market.',
  lemon: 'Add some lemon juice to your water.',
  cherry: 'Cherry blossoms bloom in spring.',
  blueberry: 'Blueberries are packed with antioxidants.',
  coconut: 'Coconut water is very hydrating.',
  avocado: 'Avocado toast is popular among young people.',
  apricot: 'Apricots are small orange fruits.',
  dog: 'My dog loves to play fetch in the park.',
  cat: 'The cat is sleeping peacefully on the sofa.',
  elephant: 'Elephants are the largest land animals on Earth.',
  tiger: 'Tigers are powerful and majestic creatures.',
  lion: 'The lion is known as the king of the jungle.',
  bear: 'Bears hibernate during the cold winter months.',
  rabbit: 'The rabbit hops quickly across the meadow.',
  monkey: 'Monkeys love to swing from tree to tree.',
  penguin: 'Penguins cannot fly but they are excellent swimmers.',
  giraffe: 'Giraffes have the longest necks of any animal.',
  dolphin: 'Dolphins are among the smartest animals in the ocean.',
  butterfly: 'A beautiful butterfly landed on the flower.',
  squirrel: 'The squirrel gathered nuts for the winter.',
  kangaroo: 'Kangaroos carry their babies in a pouch.',
  panda: 'Pandas spend most of their day eating bamboo.',
  crimson: 'The crimson sunset painted the sky in brilliant colors.',
  turquoise: 'She wore a stunning turquoise necklace.',
  magenta: 'The magenta flowers stood out against the green leaves.',
  lavender: 'The field of lavender smelled wonderful.',
  coral: 'Coral reefs are home to many sea creatures.',
  olive: 'Olive oil is healthy and delicious.',
  maroon: 'He drove a maroon-colored car.',
  beige: 'The walls were painted a soft beige color.',
  ivory: 'The ivory wedding dress looked elegant.',
  gold: 'She received a gold medal for her achievement.',
  first: 'This is my first time visiting Beijing.',
  second: 'Take the second turn on the left.',
  third: 'He finished in third place in the race.',
  hundred: 'The book has over a hundred pages.',
  thousand: 'A thousand stars shone brightly in the sky.',
  million: 'One million people attended the concert.',
  billion: 'The company is worth several billion dollars.',
  half: 'Cut the cake in half, please.',
  quarter: 'I\'d like a quarter pound of beef.',
  double: 'Double the recipe for a bigger batch.',
  parent: 'Every parent wants the best for their child.',
  son: 'Her son just started kindergarten.',
  daughter: 'His daughter won the art competition.',
  husband: 'She introduced her husband to her colleagues.',
  wife: 'The couple has been married for twenty years.',
  grandparent: 'My grandparents tell the best stories.',
  grandson: 'His grandson visits him every weekend.',
  granddaughter: 'She dotes on her granddaughter.',
  stepfather: 'Her stepfather supported her dreams.',
  inlaw: 'I am meeting my inlaws for dinner tonight.',
  noodle: 'I love eating hot noodles in winter.',
  soup: 'Mom made chicken soup for me.',
  salad: 'I ordered a garden salad for lunch.',
  pizza: 'Let\'s order a pepperoni pizza tonight.',
  burger: 'I\'ll have a cheeseburger with fries.',
  cake: 'We celebrated with a chocolate birthday cake.',
  cookie: 'Mom baked chocolate chip cookies.',
  cheese: 'I love melted cheese on toast.',
  butter: 'Add some butter to the pan.',
  coffee: 'I need my morning cup of coffee.',
  juice: 'Fresh orange juice is the best.',
  pasta: 'Spaghetti is my favorite Italian pasta.',
  steak: 'The steak was cooked to perfection.',
  pancake: 'Fluffy pancakes with maple syrup!',
  sandwich: 'I made a turkey sandwich for lunch.',
  chocolate: 'Dark chocolate is healthier than milk chocolate.',
  candy: 'Children love candy on Halloween.',
  honey: 'Honey is a natural sweetener.',
  salt: 'Please pass me the salt.',
  pepper: 'Add some black pepper to taste.',
  time: 'Time flies when you are having fun.',
  day: 'What a beautiful sunny day!',
  night: 'Good night, sleep well.',
  music: 'I enjoy listening to classical music.',
  happy: 'She looks very happy today.',
  beautiful: 'The sunset was absolutely beautiful.',
  important: 'Education is very important for everyone.',
  different: 'They have different opinions on the matter.',
  weather: 'The weather is nice today for a walk.',
  work: 'He goes to work by bus every day.',
  money: 'Money cannot buy happiness.',
  city: 'New York is a vibrant and exciting city.',
  country: 'China is a large and diverse country.',
  love: 'Love makes the world go round.',
  book: 'I am reading an interesting book right now.',
  water: 'Please give me a glass of water.',
  friend: 'She is my best friend since childhood.',
  school: 'The children go to school every weekday.',
  house: 'They live in a cozy little house.',
  dream: 'Never give up on your dreams.',
};

async function main() {
  console.log('🌱 Seeding database with 100 words...');

  // Create a default user
  const user = await prisma.user.upsert({
    where: { username: 'demo_user' },
    update: {},
    create: {
      username: 'demo_user',
      streak: 0,
      totalXP: 0,
    },
  });
  console.log('✅ Default user created:', user.username);

  // Create words
  for (const w of words) {
    const key = w.word.toLowerCase();
    await prisma.word.create({
      data: {
        ...w,
        example: exampleSentences[key] || `This is an example sentence with "${w.word}".`,
      },
    });
  }
  console.log(`✅ ${words.length} words seeded`);

  // Create word progress for the demo user
  for (const w of words) {
    const existingWord = await prisma.word.findUnique({
      where: { word: w.word },
    });
    if (existingWord) {
      await prisma.wordProgress.create({
        data: {
          userId: user.id,
          wordId: existingWord.id,
          mastery: 0,
          correct: 0,
          wrong: 0,
          reviewCount: 0,
        },
      });
    }
  }
  console.log(`✅ Word progress records created for all ${words.length} words`);

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
