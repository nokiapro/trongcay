
const DEFAULT_PLANTS = [
  {
    id: 'hoa-hong',
    icon: '🌹',
    name: 'Hoa Hồng',
    type: 'hoa',
    seedPrice: 50,
    growTime: 49204,
    growStages: [31429, 37279, 47853, 49204],
    yield: 2,
    sellPrice: 40,
    xp: 8,
    desc: 'Hoa hồng đỏ rực rỡ.'
  },
  {
    id: 'hoa-huong-duong',
    icon: '🌻',
    name: 'Hướng Dương',
    type: 'hoa',
    seedPrice: 40,
    growTime: 57552,
    growStages: [32228, 33383, 39907, 57552],
    yield: 3,
    sellPrice: 25,
    xp: 6,
    desc: 'Hướng về phía mặt trời.'
  },
  {
    id: 'hoa-tulip',
    icon: '🌷',
    name: 'Tulip',
    type: 'hoa',
    seedPrice: 60,
    growTime: 49204,
    growStages: [20407, 24785, 29956, 49204],
    yield: 2,
    sellPrice: 50,
    xp: 10,
    desc: 'Hoa tulip thanh lịch.'
  },
  {
    id: 'hoa-cuc',
    icon: '🌼',
    name: 'Hoa Cúc',
    type: 'hoa',
    seedPrice: 35,
    growTime: 57174,
    growStages: [34259, 35992, 46047, 57174],
    yield: 3,
    sellPrice: 20,
    xp: 5,
    desc: 'Hoa cúc vàng tươi.'
  },
  {
    id: 'hoa-lan',
    icon: '🌺',
    name: 'Hoa Lan',
    type: 'hoa',
    seedPrice: 90,
    growTime: 38272,
    growStages: [20009, 23002, 28032, 38272],
    yield: 1,
    sellPrice: 80,
    xp: 15,
    desc: 'Lan quý phái.'
  },
  {
    id: 'hoa-mai',
    icon: '🌸',
    name: 'Hoa Mai',
    type: 'hoa',
    seedPrice: 70,
    growTime: 41374,
    growStages: [23856, 29185, 32481, 41374],
    yield: 2,
    sellPrice: 55,
    xp: 12,
    desc: 'Mai vàng ngày Tết.'
  },
  {
    id: 'hoa-dao',
    icon: '🌸',
    name: 'Hoa Đào',
    type: 'hoa',
    seedPrice: 65,
    growTime: 59192,
    growStages: [36361, 42977, 46684, 59192],
    yield: 2,
    sellPrice: 50,
    xp: 11,
    desc: 'Đào hồng ngày xuân.'
  },
  {
    id: 'hoa-sen',
    icon: '🪷',
    name: 'Hoa Sen',
    type: 'hoa',
    seedPrice: 55,
    growTime: 50776,
    growStages: [30146, 35319, 38867, 50776],
    yield: 2,
    sellPrice: 45,
    xp: 10,
    desc: 'Sen thanh khiết.'
  },
  {
    id: 'hoa-sung',
    icon: '💮',
    name: 'Hoa Súng',
    type: 'hoa',
    seedPrice: 45,
    growTime: 56807,
    growStages: [33773, 39897, 42865, 56807],
    yield: 2,
    sellPrice: 35,
    xp: 7,
    desc: 'Súng nước dịu dàng.'
  },
  {
    id: 'hoa-hue',
    icon: '🤍',
    name: 'Hoa Huệ',
    type: 'hoa',
    seedPrice: 50,
    growTime: 39381,
    growStages: [5515, 12470, 22302, 39381],
    yield: 2,
    sellPrice: 40,
    xp: 8,
    desc: 'Huệ trắng thơm.'
  },
  {
    id: 'hoa-cam-tu',
    icon: '💐',
    name: 'Cẩm Tú Cầu',
    type: 'hoa',
    seedPrice: 60,
    growTime: 48449,
    growStages: [29532, 30315, 33879, 48449],
    yield: 2,
    sellPrice: 48,
    xp: 9,
    desc: 'Cẩm tú cầu đổi màu.'
  },
  {
    id: 'hoa-mau-don',
    icon: '🏵️',
    name: 'Mẫu Đơn',
    type: 'hoa',
    seedPrice: 85,
    growTime: 41004,
    growStages: [28611, 30527, 34539, 41004],
    yield: 1,
    sellPrice: 75,
    xp: 14,
    desc: 'Mẫu đơn vương giả.'
  },
  {
    id: 'hoa-ly',
    icon: '🌺',
    name: 'Hoa Ly',
    type: 'hoa',
    seedPrice: 55,
    growTime: 44295,
    growStages: [7512, 10414, 24247, 44295],
    yield: 2,
    sellPrice: 42,
    xp: 8,
    desc: 'Ly thơm nồng.'
  },
  {
    id: 'hoa-dong-tien',
    icon: '🌼',
    name: 'Đồng Tiền',
    type: 'hoa',
    seedPrice: 30,
    growTime: 43913,
    growStages: [6689, 10560, 24289, 43913],
    yield: 4,
    sellPrice: 18,
    xp: 4,
    desc: 'Đồng tiền may mắn.'
  },
  {
    id: 'hoa-van-tho',
    icon: '🧡',
    name: 'Vạn Thọ',
    type: 'hoa',
    seedPrice: 28,
    growTime: 52041,
    growStages: [34170, 41085, 51475, 52041],
    yield: 3,
    sellPrice: 16,
    xp: 4,
    desc: 'Vạn thọ rực rỡ.'
  },
  {
    id: 'hoa-da-quy',
    icon: '🟡',
    name: 'Dã Quỳ',
    type: 'hoa',
    seedPrice: 32,
    growTime: 52670,
    growStages: [31153, 33943, 35340, 52670],
    yield: 3,
    sellPrice: 20,
    xp: 5,
    desc: 'Dã quỳ vàng núi.'
  },
  {
    id: 'hoa-thuoc-duoc',
    icon: '💗',
    name: 'Thược Dược',
    type: 'hoa',
    seedPrice: 48,
    growTime: 28488,
    growStages: [2857, 5275, 18116, 28488],
    yield: 2,
    sellPrice: 38,
    xp: 7,
    desc: 'Thược dược nhiều màu.'
  },
  {
    id: 'hoa-cuc-hoa-mi',
    icon: '⚪',
    name: 'Cúc Họa Mi',
    type: 'hoa',
    seedPrice: 25,
    growTime: 38425,
    growStages: [6604, 12757, 26026, 38425],
    yield: 4,
    sellPrice: 14,
    xp: 3,
    desc: 'Cúc họa mi trắng.'
  },
  {
    id: 'hoa-tuong-vi',
    icon: '🩷',
    name: 'Tường Vi',
    type: 'hoa',
    seedPrice: 42,
    growTime: 55843,
    growStages: [35137, 36315, 39691, 55843],
    yield: 2,
    sellPrice: 32,
    xp: 6,
    desc: 'Tường vi leo giàn.'
  },
  {
    id: 'hoa-muoi-gio',
    icon: '🌺',
    name: 'Mười Giờ',
    type: 'hoa',
    seedPrice: 22,
    growTime: 34973,
    growStages: [8203, 10854, 13512, 34973],
    yield: 5,
    sellPrice: 12,
    xp: 3,
    desc: 'Nở vào mười giờ.'
  },
  {
    id: 'cam',
    icon: '🍊',
    name: 'Cây Cam',
    type: 'qua',
    seedPrice: 80,
    growTime: 46685,
    growStages: [36216, 36448, 43005, 46685],
    yield: 5,
    sellPrice: 30,
    xp: 12,
    desc: 'Cam ngọt mọng nước.'
  },
  {
    id: 'tao',
    icon: '🍎',
    name: 'Cây Táo',
    type: 'qua',
    seedPrice: 70,
    growTime: 44744,
    growStages: [31519, 35902, 39288, 44744],
    yield: 4,
    sellPrice: 28,
    xp: 11,
    desc: 'Táo đỏ giòn ngọt.'
  },
  {
    id: 'chuoi',
    icon: '🍌',
    name: 'Cây Chuối',
    type: 'qua',
    seedPrice: 55,
    growTime: 61970,
    growStages: [32723, 33144, 44600, 61970],
    yield: 6,
    sellPrice: 18,
    xp: 9,
    desc: 'Chuối chín vàng.'
  },
  {
    id: 'dua-hau',
    icon: '🍉',
    name: 'Dưa Hấu',
    type: 'qua',
    seedPrice: 90,
    growTime: 76336,
    growStages: [38947, 45198, 56849, 76336],
    yield: 2,
    sellPrice: 70,
    xp: 15,
    desc: 'Dưa hấu giải nhiệt.'
  },
  {
    id: 'xoai',
    icon: '🥭',
    name: 'Cây Xoài',
    type: 'qua',
    seedPrice: 85,
    growTime: 44134,
    growStages: [26050, 29447, 43161, 44134],
    yield: 4,
    sellPrice: 35,
    xp: 13,
    desc: 'Xoài chín thơm.'
  },
  {
    id: 'nhan',
    icon: '🟤',
    name: 'Cây Nhãn',
    type: 'qua',
    seedPrice: 75,
    growTime: 47602,
    growStages: [33972, 40217, 47385, 47602],
    yield: 5,
    sellPrice: 25,
    xp: 10,
    desc: 'Nhãn ngọt lịm.'
  },
  {
    id: 'vai',
    icon: '🔴',
    name: 'Cây Vải',
    type: 'qua',
    seedPrice: 70,
    growTime: 57980,
    growStages: [32416, 39269, 53213, 57980],
    yield: 5,
    sellPrice: 24,
    xp: 10,
    desc: 'Vải thiều ngon.'
  },
  {
    id: 'dua',
    icon: '🥥',
    name: 'Cây Dừa',
    type: 'qua',
    seedPrice: 100,
    growTime: 47206,
    growStages: [18656, 20174, 33675, 47206],
    yield: 2,
    sellPrice: 60,
    xp: 16,
    desc: 'Dừa nước mát.'
  },
  {
    id: 'nho',
    icon: '🍇',
    name: 'Cây Nho',
    type: 'qua',
    seedPrice: 95,
    growTime: 42952,
    growStages: [28766, 35244, 39838, 42952],
    yield: 6,
    sellPrice: 28,
    xp: 14,
    desc: 'Nho mọng nước.'
  },
  {
    id: 'du-du',
    icon: '🧡',
    name: 'Đu Đủ',
    type: 'qua',
    seedPrice: 50,
    growTime: 33634,
    growStages: [18544, 23095, 26291, 33634],
    yield: 4,
    sellPrice: 22,
    xp: 8,
    desc: 'Đu đủ chín vàng.'
  },
  {
    id: 'khe',
    icon: '🟡',
    name: 'Khế',
    type: 'qua',
    seedPrice: 45,
    growTime: 24119,
    growStages: [2702, 9434, 19405, 24119],
    yield: 4,
    sellPrice: 18,
    xp: 7,
    desc: 'Khế chua ngọt.'
  },
  {
    id: 'oi',
    icon: '🟢',
    name: 'Ổi',
    type: 'qua',
    seedPrice: 48,
    growTime: 27573,
    growStages: [8195, 11967, 22573, 27573],
    yield: 5,
    sellPrice: 16,
    xp: 7,
    desc: 'Ổi giòn ngọt.'
  },
  {
    id: 'mang-cut',
    icon: '🟣',
    name: 'Măng Cụt',
    type: 'qua',
    seedPrice: 110,
    growTime: 20501,
    growStages: [12663, 18153, 19253, 20501],
    yield: 3,
    sellPrice: 45,
    xp: 18,
    desc: 'Măng cụt đặc sản.'
  },
  {
    id: 'sau-rieng',
    icon: '🟢',
    name: 'Sầu Riêng',
    type: 'qua',
    seedPrice: 150,
    growTime: 59954,
    growStages: [32688, 38636, 40678, 59954],
    yield: 2,
    sellPrice: 90,
    xp: 22,
    desc: 'Sầu riêng béo ngậy.'
  },
  {
    id: 'mit',
    icon: '🟡',
    name: 'Mít',
    type: 'qua',
    seedPrice: 70,
    growTime: 27355,
    growStages: [1726, 7547, 15657, 27355],
    yield: 3,
    sellPrice: 35,
    xp: 11,
    desc: 'Mít thơm lừng.'
  },
  {
    id: 'chom-chom',
    icon: '🔴',
    name: 'Chôm Chôm',
    type: 'qua',
    seedPrice: 65,
    growTime: 45414,
    growStages: [18153, 19127, 25690, 45414],
    yield: 5,
    sellPrice: 22,
    xp: 9,
    desc: 'Chôm chôm ngọt.'
  },
  {
    id: 'mang',
    icon: '🥭',
    name: 'Mãng Cầu',
    type: 'qua',
    seedPrice: 80,
    growTime: 38163,
    growStages: [16731, 17229, 29592, 38163],
    yield: 3,
    sellPrice: 40,
    xp: 12,
    desc: 'Mãng cầu dai ngọt.'
  },
  {
    id: 'le',
    icon: '🍐',
    name: 'Lê',
    type: 'qua',
    seedPrice: 60,
    growTime: 51165,
    growStages: [32479, 36160, 45791, 51165],
    yield: 4,
    sellPrice: 26,
    xp: 9,
    desc: 'Lê giòn mát.'
  },
  {
    id: 'dao-qua',
    icon: '🍑',
    name: 'Đào',
    type: 'qua',
    seedPrice: 75,
    growTime: 38587,
    growStages: [23494, 25843, 32615, 38587],
    yield: 3,
    sellPrice: 32,
    xp: 11,
    desc: 'Đào mọng.'
  },
  {
    id: 'cherry',
    icon: '🍒',
    name: 'Cherry',
    type: 'qua',
    seedPrice: 120,
    growTime: 27039,
    growStages: [12466, 15088, 17200, 27039],
    yield: 4,
    sellPrice: 40,
    xp: 16,
    desc: 'Cherry đỏ mọng.'
  },
  {
    id: 'ca-chua',
    icon: '🍅',
    name: 'Cà Chua',
    type: 'rau',
    seedPrice: 35,
    growTime: 63784,
    growStages: [40355, 44493, 52848, 63784],
    yield: 5,
    sellPrice: 15,
    xp: 5,
    desc: 'Cà chua đỏ mọng.'
  },
  {
    id: 'ca-rot',
    icon: '🥕',
    name: 'Cà Rốt',
    type: 'rau',
    seedPrice: 30,
    growTime: 36730,
    growStages: [9124, 15163, 19920, 36730],
    yield: 4,
    sellPrice: 14,
    xp: 5,
    desc: 'Cà rốt tốt cho mắt.'
  },
  {
    id: 'xa-lach',
    icon: '🥬',
    name: 'Xà Lách',
    type: 'rau',
    seedPrice: 25,
    growTime: 31324,
    growStages: [6723, 7426, 20845, 31324],
    yield: 3,
    sellPrice: 12,
    xp: 4,
    desc: 'Xà lách xanh tươi.'
  },
  {
    id: 'cai-thao',
    icon: '🥬',
    name: 'Cải Thảo',
    type: 'rau',
    seedPrice: 28,
    growTime: 42558,
    growStages: [16730, 20209, 33372, 42558],
    yield: 4,
    sellPrice: 13,
    xp: 4,
    desc: 'Cải thảo giòn.'
  },
  {
    id: 'cai-ngot',
    icon: '🌿',
    name: 'Cải Ngọt',
    type: 'rau',
    seedPrice: 22,
    growTime: 27125,
    growStages: [9205, 12822, 14511, 27125],
    yield: 4,
    sellPrice: 10,
    xp: 3,
    desc: 'Cải ngọt dễ trồng.'
  },
  {
    id: 'rau-muong',
    icon: '🌱',
    name: 'Rau Muống',
    type: 'rau',
    seedPrice: 18,
    growTime: 18385,
    growStages: [7354, 8289, 12466, 18385],
    yield: 5,
    sellPrice: 8,
    xp: 3,
    desc: 'Rau muống dân dã.'
  },
  {
    id: 'rau-den',
    icon: '🟣',
    name: 'Rau Dền',
    type: 'rau',
    seedPrice: 20,
    growTime: 58430,
    growStages: [39243, 46303, 47885, 58430],
    yield: 4,
    sellPrice: 9,
    xp: 3,
    desc: 'Rau dền đỏ.'
  },
  {
    id: 'bau',
    icon: '🟢',
    name: 'Bầu',
    type: 'rau',
    seedPrice: 40,
    growTime: 22963,
    growStages: [16123, 18870, 21298, 22963],
    yield: 3,
    sellPrice: 20,
    xp: 6,
    desc: 'Bầu nấu canh.'
  },
  {
    id: 'bi-dao',
    icon: '⬜',
    name: 'Bí Đao',
    type: 'rau',
    seedPrice: 42,
    growTime: 55595,
    growStages: [41810, 48716, 54323, 55595],
    yield: 3,
    sellPrice: 22,
    xp: 6,
    desc: 'Bí đao giải nhiệt.'
  },
  {
    id: 'bi-ngo',
    icon: '🎃',
    name: 'Bí Ngô',
    type: 'rau',
    seedPrice: 45,
    growTime: 43532,
    growStages: [26439, 26933, 35387, 43532],
    yield: 2,
    sellPrice: 28,
    xp: 7,
    desc: 'Bí ngô vàng.'
  },
  {
    id: 'dua-leo',
    icon: '🥒',
    name: 'Dưa Leo',
    type: 'rau',
    seedPrice: 32,
    growTime: 42161,
    growStages: [13079, 19529, 26874, 42161],
    yield: 4,
    sellPrice: 14,
    xp: 5,
    desc: 'Dưa leo giòn.'
  },
  {
    id: 'ot',
    icon: '🌶️',
    name: 'Ớt',
    type: 'rau',
    seedPrice: 28,
    growTime: 64836,
    growStages: [38904, 45431, 57995, 64836],
    yield: 6,
    sellPrice: 12,
    xp: 5,
    desc: 'Ớt cay nồng.'
  },
  {
    id: 'hanh',
    icon: '🧅',
    name: 'Hành',
    type: 'rau',
    seedPrice: 24,
    growTime: 43453,
    growStages: [25523, 26581, 34466, 43453],
    yield: 4,
    sellPrice: 11,
    xp: 4,
    desc: 'Hành tím.'
  },
  {
    id: 'toi',
    icon: '🧄',
    name: 'Tỏi',
    type: 'rau',
    seedPrice: 26,
    growTime: 55165,
    growStages: [28897, 32551, 40211, 55165],
    yield: 4,
    sellPrice: 12,
    xp: 4,
    desc: 'Tỏi thơm.'
  },
  {
    id: 'khoai-tay',
    icon: '🥔',
    name: 'Khoai Tây',
    type: 'rau',
    seedPrice: 38,
    growTime: 62299,
    growStages: [32797, 39295, 52417, 62299],
    yield: 4,
    sellPrice: 16,
    xp: 6,
    desc: 'Khoai tây bổ.'
  },
  {
    id: 'khoai-lang',
    icon: '🍠',
    name: 'Khoai Lang',
    type: 'rau',
    seedPrice: 35,
    growTime: 45121,
    growStages: [25914, 28947, 40215, 45121],
    yield: 4,
    sellPrice: 15,
    xp: 5,
    desc: 'Khoai lang ngọt.'
  },
  {
    id: 'bap-cai',
    icon: '🥬',
    name: 'Bắp Cải',
    type: 'rau',
    seedPrice: 30,
    growTime: 21930,
    growStages: [2101, 5458, 12632, 21930],
    yield: 3,
    sellPrice: 14,
    xp: 5,
    desc: 'Bắp cải tròn.'
  },
  {
    id: 'su-hao',
    icon: '🟢',
    name: 'Su Hào',
    type: 'rau',
    seedPrice: 28,
    growTime: 49604,
    growStages: [31395, 34490, 34802, 49604],
    yield: 3,
    sellPrice: 13,
    xp: 4,
    desc: 'Su hào giòn.'
  },
  {
    id: 'dau-cove',
    icon: '🫛',
    name: 'Đậu Cove',
    type: 'rau',
    seedPrice: 32,
    growTime: 47554,
    growStages: [38768, 42874, 43229, 47554],
    yield: 5,
    sellPrice: 14,
    xp: 5,
    desc: 'Đậu cove tươi.'
  },
  {
    id: 'mang-tay',
    icon: '🥦',
    name: 'Măng Tây',
    type: 'rau',
    seedPrice: 55,
    growTime: 38568,
    growStages: [10326, 16347, 21980, 38568],
    yield: 3,
    sellPrice: 25,
    xp: 8,
    desc: 'Măng tây cao cấp.'
  },
  {
    id: 'bonsai',
    icon: '🪴',
    name: 'Bonsai',
    type: 'cay',
    seedPrice: 150,
    growTime: 81391,
    growStages: [42126, 47374, 61113, 81391],
    yield: 1,
    sellPrice: 200,
    xp: 25,
    desc: 'Bonsai trang trí.'
  },
  {
    id: 'tre',
    icon: '🎋',
    name: 'Cây Tre',
    type: 'cay',
    seedPrice: 100,
    growTime: 53282,
    growStages: [20544, 24339, 35943, 53282],
    yield: 1,
    sellPrice: 150,
    xp: 20,
    desc: 'Tre bền bỉ.'
  },
  {
    id: 'duong',
    icon: '🌳',
    name: 'Cây Dương',
    type: 'cay',
    seedPrice: 80,
    growTime: 59390,
    growStages: [34658, 35634, 44938, 59390],
    yield: 1,
    sellPrice: 100,
    xp: 15,
    desc: 'Dương xanh mát.'
  },
  {
    id: 'phuong',
    icon: '🌳',
    name: 'Phượng',
    type: 'cay',
    seedPrice: 90,
    growTime: 36707,
    growStages: [25492, 27212, 34731, 36707],
    yield: 1,
    sellPrice: 120,
    xp: 16,
    desc: 'Phượng vĩ đỏ.'
  },
  {
    id: 'bang',
    icon: '🌳',
    name: 'Bàng',
    type: 'cay',
    seedPrice: 70,
    growTime: 42833,
    growStages: [36160, 40206, 40704, 42833],
    yield: 1,
    sellPrice: 90,
    xp: 12,
    desc: 'Bàng lá rộng.'
  },
  {
    id: 'lim',
    icon: '🪵',
    name: 'Lim',
    type: 'cay',
    seedPrice: 200,
    growTime: 57115,
    growStages: [35229, 36128, 50499, 57115],
    yield: 1,
    sellPrice: 250,
    xp: 30,
    desc: 'Gỗ lim quý.'
  },
  {
    id: 'trac',
    icon: '🪵',
    name: 'Trắc',
    type: 'cay',
    seedPrice: 220,
    growTime: 26324,
    growStages: [9925, 16706, 22816, 26324],
    yield: 1,
    sellPrice: 280,
    xp: 32,
    desc: 'Gỗ trắc.'
  },
  {
    id: 'thong',
    icon: '🌲',
    name: 'Thông',
    type: 'cay',
    seedPrice: 110,
    growTime: 18293,
    growStages: [3681, 8700, 12684, 18293],
    yield: 1,
    sellPrice: 140,
    xp: 18,
    desc: 'Thông xanh.'
  },
  {
    id: 'co',
    icon: '🌴',
    name: 'Cọ',
    type: 'cay',
    seedPrice: 95,
    growTime: 48468,
    growStages: [25319, 31341, 38872, 48468],
    yield: 1,
    sellPrice: 110,
    xp: 14,
    desc: 'Cọ biển.'
  },
  {
    id: 'mai-vang',
    icon: '🌳',
    name: 'Mai Vàng',
    type: 'cay',
    seedPrice: 130,
    growTime: 71327,
    growStages: [40857, 41456, 53304, 71327],
    yield: 1,
    sellPrice: 180,
    xp: 22,
    desc: 'Mai cảnh Tết.'
  },
  {
    id: 'la-diep-ca',
    icon: '🍃',
    name: 'Lá Diếp Cá',
    type: 'la',
    seedPrice: 20,
    growTime: 21627,
    growStages: [5180, 5242, 8686, 21627],
    yield: 4,
    sellPrice: 10,
    xp: 3,
    desc: 'Diếp cá thơm.'
  },
  {
    id: 'la-lot',
    icon: '🟢',
    name: 'Lá Lốt',
    type: 'la',
    seedPrice: 18,
    growTime: 53085,
    growStages: [25798, 31599, 44564, 53085],
    yield: 4,
    sellPrice: 9,
    xp: 3,
    desc: 'Lá lốt cuốn thịt.'
  },
  {
    id: 'la-chanh',
    icon: '🍋',
    name: 'Lá Chanh',
    type: 'la',
    seedPrice: 25,
    growTime: 59548,
    growStages: [27916, 34342, 41929, 59548],
    yield: 3,
    sellPrice: 12,
    xp: 4,
    desc: 'Lá chanh thơm.'
  },
  {
    id: 'la-dinh-lang',
    icon: '🌿',
    name: 'Đinh Lăng',
    type: 'la',
    seedPrice: 30,
    growTime: 45578,
    growStages: [10419, 16515, 30015, 45578],
    yield: 2,
    sellPrice: 18,
    xp: 5,
    desc: 'Đinh lăng bổ.'
  },
  {
    id: 'la-tra',
    icon: '🍵',
    name: 'Lá Trà',
    type: 'la',
    seedPrice: 40,
    growTime: 52369,
    growStages: [30079, 34917, 39356, 52369],
    yield: 3,
    sellPrice: 22,
    xp: 6,
    desc: 'Trà xanh.'
  },
  {
    id: 'la-bac-ha',
    icon: '🌿',
    name: 'Bạc Hà',
    type: 'la',
    seedPrice: 22,
    growTime: 31315,
    growStages: [21468, 23379, 24239, 31315],
    yield: 4,
    sellPrice: 11,
    xp: 3,
    desc: 'Bạc hà mát.'
  },
  {
    id: 'la-hung-que',
    icon: '🌿',
    name: 'Húng Quế',
    type: 'la',
    seedPrice: 20,
    growTime: 28902,
    growStages: [2520, 7872, 13670, 28902],
    yield: 4,
    sellPrice: 10,
    xp: 3,
    desc: 'Húng quế thơm.'
  },
  {
    id: 'la-kinh-gioi',
    icon: '🌱',
    name: 'Kinh Giới',
    type: 'la',
    seedPrice: 18,
    growTime: 52223,
    growStages: [21326, 25844, 32065, 52223],
    yield: 4,
    sellPrice: 9,
    xp: 3,
    desc: 'Kinh giới.'
  },
  {
    id: 'la-tia-to',
    icon: '🟣',
    name: 'Tía Tô',
    type: 'la',
    seedPrice: 20,
    growTime: 26166,
    growStages: [4737, 9406, 17013, 26166],
    yield: 4,
    sellPrice: 10,
    xp: 3,
    desc: 'Tía tô tím.'
  },
  {
    id: 'la-ngo',
    icon: '🌿',
    name: 'Rau Ngò',
    type: 'la',
    seedPrice: 16,
    growTime: 22271,
    growStages: [68, 6444, 14401, 22271],
    yield: 5,
    sellPrice: 8,
    xp: 2,
    desc: 'Ngò rí.'
  },
  {
    id: 'hoa-1',
    icon: '🌼',
    name: 'Hoa Hồng Đỏ',
    type: 'hoa',
    seedPrice: 21,
    growTime: 65869,
    growStages: [38786, 43822, 44716, 65869],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Hồng màu Đỏ.'
  },
  {
    id: 'hoa-2',
    icon: '🌺',
    name: 'Hoa Hồng Vàng',
    type: 'hoa',
    seedPrice: 22,
    growTime: 36709,
    growStages: [12140, 18504, 22345, 36709],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Hồng màu Vàng.'
  },
  {
    id: 'hoa-3',
    icon: '🌸',
    name: 'Hoa Hồng Hồng',
    type: 'hoa',
    seedPrice: 23,
    growTime: 40960,
    growStages: [11179, 13360, 23731, 40960],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Hồng màu Hồng.'
  },
  {
    id: 'hoa-4',
    icon: '🪷',
    name: 'Hoa Hồng Trắng',
    type: 'hoa',
    seedPrice: 24,
    growTime: 35494,
    growStages: [32833, 33952, 34464, 35494],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Hồng màu Trắng.'
  },
  {
    id: 'hoa-5',
    icon: '💮',
    name: 'Hoa Hồng Tím',
    type: 'hoa',
    seedPrice: 25,
    growTime: 55382,
    growStages: [32259, 33993, 42354, 55382],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Hồng màu Tím.'
  },
  {
    id: 'hoa-6',
    icon: '🌻',
    name: 'Hoa Hồng Cam',
    type: 'hoa',
    seedPrice: 26,
    growTime: 47053,
    growStages: [10075, 13596, 25688, 47053],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Hồng màu Cam.'
  },
  {
    id: 'hoa-7',
    icon: '🌷',
    name: 'Hoa Hồng Xanh',
    type: 'hoa',
    seedPrice: 27,
    growTime: 48492,
    growStages: [41505, 42200, 47819, 48492],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Hồng màu Xanh.'
  },
  {
    id: 'hoa-8',
    icon: '💐',
    name: 'Hoa Hồng Biếc',
    type: 'hoa',
    seedPrice: 28,
    growTime: 63472,
    growStages: [30848, 30911, 44819, 63472],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Hồng màu Biếc.'
  },
  {
    id: 'hoa-9',
    icon: '🏵️',
    name: 'Hoa Hồng Sọc',
    type: 'hoa',
    seedPrice: 29,
    growTime: 53296,
    growStages: [30697, 33165, 40696, 53296],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Hồng màu Sọc.'
  },
  {
    id: 'hoa-10',
    icon: '🧡',
    name: 'Hoa Hồng Đốm',
    type: 'hoa',
    seedPrice: 30,
    growTime: 27743,
    growStages: [4719, 10699, 20335, 27743],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Hồng màu Đốm.'
  },
  {
    id: 'hoa-11',
    icon: '💗',
    name: 'Hoa Cúc Đỏ',
    type: 'hoa',
    seedPrice: 31,
    growTime: 44850,
    growStages: [26823, 33299, 42995, 44850],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Cúc màu Đỏ.'
  },
  {
    id: 'hoa-12',
    icon: '🩷',
    name: 'Hoa Cúc Vàng',
    type: 'hoa',
    seedPrice: 32,
    growTime: 38201,
    growStages: [12151, 17223, 21527, 38201],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Cúc màu Vàng.'
  },
  {
    id: 'hoa-13',
    icon: '🟡',
    name: 'Hoa Cúc Hồng',
    type: 'hoa',
    seedPrice: 33,
    growTime: 19681,
    growStages: [1696, 4959, 15707, 19681],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Cúc màu Hồng.'
  },
  {
    id: 'hoa-14',
    icon: '⚪',
    name: 'Hoa Cúc Trắng',
    type: 'hoa',
    seedPrice: 34,
    growTime: 37879,
    growStages: [11863, 18636, 21609, 37879],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Cúc màu Trắng.'
  },
  {
    id: 'hoa-15',
    icon: '🌹',
    name: 'Hoa Cúc Tím',
    type: 'hoa',
    seedPrice: 35,
    growTime: 50291,
    growStages: [27842, 35027, 35549, 50291],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Cúc màu Tím.'
  },
  {
    id: 'hoa-16',
    icon: '🌼',
    name: 'Hoa Cúc Cam',
    type: 'hoa',
    seedPrice: 36,
    growTime: 54014,
    growStages: [28979, 31621, 45402, 54014],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Cúc màu Cam.'
  },
  {
    id: 'hoa-17',
    icon: '🌺',
    name: 'Hoa Cúc Xanh',
    type: 'hoa',
    seedPrice: 37,
    growTime: 44803,
    growStages: [12667, 12731, 27104, 44803],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Cúc màu Xanh.'
  },
  {
    id: 'hoa-18',
    icon: '🌸',
    name: 'Hoa Cúc Biếc',
    type: 'hoa',
    seedPrice: 38,
    growTime: 67548,
    growStages: [34423, 39238, 47067, 67548],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Cúc màu Biếc.'
  },
  {
    id: 'hoa-19',
    icon: '🪷',
    name: 'Hoa Cúc Sọc',
    type: 'hoa',
    seedPrice: 39,
    growTime: 39196,
    growStages: [22219, 22403, 32012, 39196],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Cúc màu Sọc.'
  },
  {
    id: 'hoa-20',
    icon: '💮',
    name: 'Hoa Cúc Đốm',
    type: 'hoa',
    seedPrice: 40,
    growTime: 70516,
    growStages: [43024, 43690, 57280, 70516],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Cúc màu Đốm.'
  },
  {
    id: 'hoa-21',
    icon: '🌻',
    name: 'Hoa Lan Đỏ',
    type: 'hoa',
    seedPrice: 41,
    growTime: 19534,
    growStages: [1344, 5623, 7574, 19534],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Lan màu Đỏ.'
  },
  {
    id: 'hoa-22',
    icon: '🌷',
    name: 'Hoa Lan Vàng',
    type: 'hoa',
    seedPrice: 42,
    growTime: 38697,
    growStages: [18873, 23808, 27266, 38697],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Lan màu Vàng.'
  },
  {
    id: 'hoa-23',
    icon: '💐',
    name: 'Hoa Lan Hồng',
    type: 'hoa',
    seedPrice: 43,
    growTime: 42836,
    growStages: [27966, 30843, 38803, 42836],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Lan màu Hồng.'
  },
  {
    id: 'hoa-24',
    icon: '🏵️',
    name: 'Hoa Lan Trắng',
    type: 'hoa',
    seedPrice: 44,
    growTime: 54872,
    growStages: [40206, 44857, 53140, 54872],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Lan màu Trắng.'
  },
  {
    id: 'hoa-25',
    icon: '🧡',
    name: 'Hoa Lan Tím',
    type: 'hoa',
    seedPrice: 45,
    growTime: 49289,
    growStages: [39737, 41758, 47529, 49289],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Lan màu Tím.'
  },
  {
    id: 'hoa-26',
    icon: '💗',
    name: 'Hoa Lan Cam',
    type: 'hoa',
    seedPrice: 46,
    growTime: 67022,
    growStages: [42494, 47534, 54111, 67022],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Lan màu Cam.'
  },
  {
    id: 'hoa-27',
    icon: '🩷',
    name: 'Hoa Lan Xanh',
    type: 'hoa',
    seedPrice: 47,
    growTime: 46938,
    growStages: [28374, 35095, 40353, 46938],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Lan màu Xanh.'
  },
  {
    id: 'hoa-28',
    icon: '🟡',
    name: 'Hoa Lan Biếc',
    type: 'hoa',
    seedPrice: 48,
    growTime: 42788,
    growStages: [30511, 33928, 41809, 42788],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Lan màu Biếc.'
  },
  {
    id: 'hoa-29',
    icon: '⚪',
    name: 'Hoa Lan Sọc',
    type: 'hoa',
    seedPrice: 49,
    growTime: 63418,
    growStages: [42865, 46031, 46922, 63418],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Lan màu Sọc.'
  },
  {
    id: 'hoa-30',
    icon: '🌹',
    name: 'Hoa Lan Đốm',
    type: 'hoa',
    seedPrice: 50,
    growTime: 37453,
    growStages: [6243, 10612, 20291, 37453],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Lan màu Đốm.'
  },
  {
    id: 'hoa-31',
    icon: '🌼',
    name: 'Hoa Ly Đỏ',
    type: 'hoa',
    seedPrice: 51,
    growTime: 42967,
    growStages: [19321, 24342, 28604, 42967],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Ly màu Đỏ.'
  },
  {
    id: 'hoa-32',
    icon: '🌺',
    name: 'Hoa Ly Vàng',
    type: 'hoa',
    seedPrice: 52,
    growTime: 36757,
    growStages: [3261, 10459, 24569, 36757],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Ly màu Vàng.'
  },
  {
    id: 'hoa-33',
    icon: '🌸',
    name: 'Hoa Ly Hồng',
    type: 'hoa',
    seedPrice: 53,
    growTime: 49217,
    growStages: [18923, 20578, 30335, 49217],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Ly màu Hồng.'
  },
  {
    id: 'hoa-34',
    icon: '🪷',
    name: 'Hoa Ly Trắng',
    type: 'hoa',
    seedPrice: 54,
    growTime: 51777,
    growStages: [14950, 19717, 30553, 51777],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Ly màu Trắng.'
  },
  {
    id: 'hoa-35',
    icon: '💮',
    name: 'Hoa Ly Tím',
    type: 'hoa',
    seedPrice: 55,
    growTime: 40491,
    growStages: [19998, 21608, 25657, 40491],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Ly màu Tím.'
  },
  {
    id: 'hoa-36',
    icon: '🌻',
    name: 'Hoa Ly Cam',
    type: 'hoa',
    seedPrice: 56,
    growTime: 54696,
    growStages: [25031, 30318, 43705, 54696],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Ly màu Cam.'
  },
  {
    id: 'hoa-37',
    icon: '🌷',
    name: 'Hoa Ly Xanh',
    type: 'hoa',
    seedPrice: 57,
    growTime: 22683,
    growStages: [6829, 13568, 20672, 22683],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Ly màu Xanh.'
  },
  {
    id: 'hoa-38',
    icon: '💐',
    name: 'Hoa Ly Biếc',
    type: 'hoa',
    seedPrice: 58,
    growTime: 38676,
    growStages: [13060, 17931, 20583, 38676],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Ly màu Biếc.'
  },
  {
    id: 'hoa-39',
    icon: '🏵️',
    name: 'Hoa Ly Sọc',
    type: 'hoa',
    seedPrice: 59,
    growTime: 38883,
    growStages: [20338, 21151, 25878, 38883],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Ly màu Sọc.'
  },
  {
    id: 'hoa-40',
    icon: '🧡',
    name: 'Hoa Ly Đốm',
    type: 'hoa',
    seedPrice: 60,
    growTime: 73798,
    growStages: [39134, 44063, 55283, 73798],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Ly màu Đốm.'
  },
  {
    id: 'hoa-41',
    icon: '💗',
    name: 'Hoa Sen Đỏ',
    type: 'hoa',
    seedPrice: 61,
    growTime: 33775,
    growStages: [9186, 16055, 29550, 33775],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Sen màu Đỏ.'
  },
  {
    id: 'hoa-42',
    icon: '🩷',
    name: 'Hoa Sen Vàng',
    type: 'hoa',
    seedPrice: 62,
    growTime: 39784,
    growStages: [14838, 19504, 29905, 39784],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Sen màu Vàng.'
  },
  {
    id: 'hoa-43',
    icon: '🟡',
    name: 'Hoa Sen Hồng',
    type: 'hoa',
    seedPrice: 63,
    growTime: 42911,
    growStages: [19482, 23209, 37492, 42911],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Sen màu Hồng.'
  },
  {
    id: 'hoa-44',
    icon: '⚪',
    name: 'Hoa Sen Trắng',
    type: 'hoa',
    seedPrice: 64,
    growTime: 57234,
    growStages: [36237, 37119, 38228, 57234],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Sen màu Trắng.'
  },
  {
    id: 'hoa-45',
    icon: '🌹',
    name: 'Hoa Sen Tím',
    type: 'hoa',
    seedPrice: 65,
    growTime: 64889,
    growStages: [35191, 41593, 43625, 64889],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Sen màu Tím.'
  },
  {
    id: 'hoa-46',
    icon: '🌼',
    name: 'Hoa Sen Cam',
    type: 'hoa',
    seedPrice: 66,
    growTime: 67853,
    growStages: [36589, 41398, 49569, 67853],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Sen màu Cam.'
  },
  {
    id: 'hoa-47',
    icon: '🌺',
    name: 'Hoa Sen Xanh',
    type: 'hoa',
    seedPrice: 67,
    growTime: 24663,
    growStages: [16970, 19255, 24271, 24663],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Sen màu Xanh.'
  },
  {
    id: 'hoa-48',
    icon: '🌸',
    name: 'Hoa Sen Biếc',
    type: 'hoa',
    seedPrice: 68,
    growTime: 14002,
    growStages: [275, 4237, 9877, 14002],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Sen màu Biếc.'
  },
  {
    id: 'hoa-49',
    icon: '🪷',
    name: 'Hoa Sen Sọc',
    type: 'hoa',
    seedPrice: 69,
    growTime: 45332,
    growStages: [22924, 26662, 33444, 45332],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Sen màu Sọc.'
  },
  {
    id: 'hoa-50',
    icon: '💮',
    name: 'Hoa Sen Đốm',
    type: 'hoa',
    seedPrice: 70,
    growTime: 13678,
    growStages: [3640, 3721, 12460, 13678],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Sen màu Đốm.'
  },
  {
    id: 'hoa-51',
    icon: '🌻',
    name: 'Hoa Huệ Đỏ',
    type: 'hoa',
    seedPrice: 71,
    growTime: 61010,
    growStages: [35187, 40209, 53064, 61010],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Huệ màu Đỏ.'
  },
  {
    id: 'hoa-52',
    icon: '🌷',
    name: 'Hoa Huệ Vàng',
    type: 'hoa',
    seedPrice: 72,
    growTime: 33946,
    growStages: [8708, 11365, 21478, 33946],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Huệ màu Vàng.'
  },
  {
    id: 'hoa-53',
    icon: '💐',
    name: 'Hoa Huệ Hồng',
    type: 'hoa',
    seedPrice: 73,
    growTime: 25702,
    growStages: [6190, 9496, 22596, 25702],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Huệ màu Hồng.'
  },
  {
    id: 'hoa-54',
    icon: '🏵️',
    name: 'Hoa Huệ Trắng',
    type: 'hoa',
    seedPrice: 74,
    growTime: 59898,
    growStages: [37177, 43829, 50564, 59898],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Huệ màu Trắng.'
  },
  {
    id: 'hoa-55',
    icon: '🧡',
    name: 'Hoa Huệ Tím',
    type: 'hoa',
    seedPrice: 75,
    growTime: 26166,
    growStages: [1150, 5617, 17252, 26166],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Huệ màu Tím.'
  },
  {
    id: 'hoa-56',
    icon: '💗',
    name: 'Hoa Huệ Cam',
    type: 'hoa',
    seedPrice: 76,
    growTime: 61409,
    growStages: [32700, 33026, 41537, 61409],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Huệ màu Cam.'
  },
  {
    id: 'hoa-57',
    icon: '🩷',
    name: 'Hoa Huệ Xanh',
    type: 'hoa',
    seedPrice: 77,
    growTime: 42726,
    growStages: [31312, 35274, 39820, 42726],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Huệ màu Xanh.'
  },
  {
    id: 'hoa-58',
    icon: '🟡',
    name: 'Hoa Huệ Biếc',
    type: 'hoa',
    seedPrice: 78,
    growTime: 52215,
    growStages: [34065, 39883, 42698, 52215],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Huệ màu Biếc.'
  },
  {
    id: 'hoa-59',
    icon: '⚪',
    name: 'Hoa Huệ Sọc',
    type: 'hoa',
    seedPrice: 79,
    growTime: 51167,
    growStages: [27751, 33609, 41962, 51167],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Huệ màu Sọc.'
  },
  {
    id: 'hoa-60',
    icon: '🌹',
    name: 'Hoa Huệ Đốm',
    type: 'hoa',
    seedPrice: 80,
    growTime: 43113,
    growStages: [26326, 26734, 32516, 43113],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Huệ màu Đốm.'
  },
  {
    id: 'hoa-61',
    icon: '🌼',
    name: 'Hoa Mai Đỏ',
    type: 'hoa',
    seedPrice: 81,
    growTime: 14169,
    growStages: [4843, 9372, 13263, 14169],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Mai màu Đỏ.'
  },
  {
    id: 'hoa-62',
    icon: '🌺',
    name: 'Hoa Mai Vàng',
    type: 'hoa',
    seedPrice: 82,
    growTime: 51622,
    growStages: [20334, 27501, 36374, 51622],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Mai màu Vàng.'
  },
  {
    id: 'hoa-63',
    icon: '🌸',
    name: 'Hoa Mai Hồng',
    type: 'hoa',
    seedPrice: 83,
    growTime: 49960,
    growStages: [38614, 42096, 46162, 49960],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Mai màu Hồng.'
  },
  {
    id: 'hoa-64',
    icon: '🪷',
    name: 'Hoa Mai Trắng',
    type: 'hoa',
    seedPrice: 84,
    growTime: 25031,
    growStages: [15791, 21071, 22873, 25031],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Mai màu Trắng.'
  },
  {
    id: 'hoa-65',
    icon: '💮',
    name: 'Hoa Mai Tím',
    type: 'hoa',
    seedPrice: 85,
    growTime: 36976,
    growStages: [18546, 21284, 25353, 36976],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Mai màu Tím.'
  },
  {
    id: 'hoa-66',
    icon: '🌻',
    name: 'Hoa Mai Cam',
    type: 'hoa',
    seedPrice: 86,
    growTime: 57366,
    growStages: [30249, 34743, 42166, 57366],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Mai màu Cam.'
  },
  {
    id: 'hoa-67',
    icon: '🌷',
    name: 'Hoa Mai Xanh',
    type: 'hoa',
    seedPrice: 87,
    growTime: 33737,
    growStages: [18262, 22966, 27810, 33737],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Mai màu Xanh.'
  },
  {
    id: 'hoa-68',
    icon: '💐',
    name: 'Hoa Mai Biếc',
    type: 'hoa',
    seedPrice: 88,
    growTime: 45438,
    growStages: [22137, 23749, 33605, 45438],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Mai màu Biếc.'
  },
  {
    id: 'hoa-69',
    icon: '🏵️',
    name: 'Hoa Mai Sọc',
    type: 'hoa',
    seedPrice: 89,
    growTime: 74388,
    growStages: [41111, 47724, 55489, 74388],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Mai màu Sọc.'
  },
  {
    id: 'hoa-70',
    icon: '🧡',
    name: 'Hoa Mai Đốm',
    type: 'hoa',
    seedPrice: 90,
    growTime: 42156,
    growStages: [26773, 27568, 32545, 42156],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Mai màu Đốm.'
  },
  {
    id: 'hoa-71',
    icon: '💗',
    name: 'Hoa Đào Đỏ',
    type: 'hoa',
    seedPrice: 91,
    growTime: 20016,
    growStages: [3950, 9748, 11270, 20016],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Đào màu Đỏ.'
  },
  {
    id: 'hoa-72',
    icon: '🩷',
    name: 'Hoa Đào Vàng',
    type: 'hoa',
    seedPrice: 92,
    growTime: 47397,
    growStages: [20315, 20598, 33242, 47397],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Đào màu Vàng.'
  },
  {
    id: 'hoa-73',
    icon: '🟡',
    name: 'Hoa Đào Hồng',
    type: 'hoa',
    seedPrice: 93,
    growTime: 20065,
    growStages: [10717, 10842, 11313, 20065],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Đào màu Hồng.'
  },
  {
    id: 'hoa-74',
    icon: '⚪',
    name: 'Hoa Đào Trắng',
    type: 'hoa',
    seedPrice: 94,
    growTime: 29671,
    growStages: [11821, 12525, 13576, 29671],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Đào màu Trắng.'
  },
  {
    id: 'hoa-75',
    icon: '🌹',
    name: 'Hoa Đào Tím',
    type: 'hoa',
    seedPrice: 95,
    growTime: 45886,
    growStages: [22344, 23682, 36326, 45886],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Đào màu Tím.'
  },
  {
    id: 'hoa-76',
    icon: '🌼',
    name: 'Hoa Đào Cam',
    type: 'hoa',
    seedPrice: 96,
    growTime: 53220,
    growStages: [30812, 35195, 49163, 53220],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Đào màu Cam.'
  },
  {
    id: 'hoa-77',
    icon: '🌺',
    name: 'Hoa Đào Xanh',
    type: 'hoa',
    seedPrice: 97,
    growTime: 47152,
    growStages: [13395, 17926, 29797, 47152],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Đào màu Xanh.'
  },
  {
    id: 'hoa-78',
    icon: '🌸',
    name: 'Hoa Đào Biếc',
    type: 'hoa',
    seedPrice: 98,
    growTime: 41559,
    growStages: [19759, 23267, 30893, 41559],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Đào màu Biếc.'
  },
  {
    id: 'hoa-79',
    icon: '🪷',
    name: 'Hoa Đào Sọc',
    type: 'hoa',
    seedPrice: 99,
    growTime: 27956,
    growStages: [883, 3008, 7522, 27956],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Đào màu Sọc.'
  },
  {
    id: 'hoa-80',
    icon: '💮',
    name: 'Hoa Đào Đốm',
    type: 'hoa',
    seedPrice: 20,
    growTime: 42945,
    growStages: [23632, 29241, 42281, 42945],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Đào màu Đốm.'
  },
  {
    id: 'hoa-81',
    icon: '🌻',
    name: 'Hoa Tường Vi Đỏ',
    type: 'hoa',
    seedPrice: 21,
    growTime: 43194,
    growStages: [13056, 14843, 26646, 43194],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Tường Vi màu Đỏ.'
  },
  {
    id: 'hoa-82',
    icon: '🌷',
    name: 'Hoa Tường Vi Vàng',
    type: 'hoa',
    seedPrice: 22,
    growTime: 19071,
    growStages: [6337, 12654, 18292, 19071],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Tường Vi màu Vàng.'
  },
  {
    id: 'hoa-83',
    icon: '💐',
    name: 'Hoa Tường Vi Hồng',
    type: 'hoa',
    seedPrice: 23,
    growTime: 65745,
    growStages: [41898, 44572, 49661, 65745],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Tường Vi màu Hồng.'
  },
  {
    id: 'hoa-84',
    icon: '🏵️',
    name: 'Hoa Tường Vi Trắng',
    type: 'hoa',
    seedPrice: 24,
    growTime: 65235,
    growStages: [36041, 41981, 48691, 65235],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Tường Vi màu Trắng.'
  },
  {
    id: 'hoa-85',
    icon: '🧡',
    name: 'Hoa Tường Vi Tím',
    type: 'hoa',
    seedPrice: 25,
    growTime: 33258,
    growStages: [15930, 22432, 23849, 33258],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Tường Vi màu Tím.'
  },
  {
    id: 'hoa-86',
    icon: '💗',
    name: 'Hoa Tường Vi Cam',
    type: 'hoa',
    seedPrice: 26,
    growTime: 56331,
    growStages: [22044, 24792, 37124, 56331],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Tường Vi màu Cam.'
  },
  {
    id: 'hoa-87',
    icon: '🩷',
    name: 'Hoa Tường Vi Xanh',
    type: 'hoa',
    seedPrice: 27,
    growTime: 55956,
    growStages: [40728, 41706, 45212, 55956],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Tường Vi màu Xanh.'
  },
  {
    id: 'hoa-88',
    icon: '🟡',
    name: 'Hoa Tường Vi Biếc',
    type: 'hoa',
    seedPrice: 28,
    growTime: 60662,
    growStages: [22184, 28663, 41470, 60662],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Tường Vi màu Biếc.'
  },
  {
    id: 'hoa-89',
    icon: '⚪',
    name: 'Hoa Tường Vi Sọc',
    type: 'hoa',
    seedPrice: 29,
    growTime: 51404,
    growStages: [18291, 24947, 33558, 51404],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Tường Vi màu Sọc.'
  },
  {
    id: 'hoa-90',
    icon: '🌹',
    name: 'Hoa Tường Vi Đốm',
    type: 'hoa',
    seedPrice: 30,
    growTime: 55864,
    growStages: [31530, 36517, 41565, 55864],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Tường Vi màu Đốm.'
  },
  {
    id: 'hoa-91',
    icon: '🌼',
    name: 'Hoa Thược Dược Đỏ',
    type: 'hoa',
    seedPrice: 31,
    growTime: 28782,
    growStages: [2468, 5689, 7946, 28782],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Thược Dược màu Đỏ.'
  },
  {
    id: 'hoa-92',
    icon: '🌺',
    name: 'Hoa Thược Dược Vàng',
    type: 'hoa',
    seedPrice: 32,
    growTime: 28875,
    growStages: [14632, 14892, 15734, 28875],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Thược Dược màu Vàng.'
  },
  {
    id: 'hoa-93',
    icon: '🌸',
    name: 'Hoa Thược Dược Hồng',
    type: 'hoa',
    seedPrice: 33,
    growTime: 30354,
    growStages: [3013, 3353, 11130, 30354],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Thược Dược màu Hồng.'
  },
  {
    id: 'hoa-94',
    icon: '🪷',
    name: 'Hoa Thược Dược Trắng',
    type: 'hoa',
    seedPrice: 34,
    growTime: 42726,
    growStages: [37033, 37157, 37913, 42726],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Thược Dược màu Trắng.'
  },
  {
    id: 'hoa-95',
    icon: '💮',
    name: 'Hoa Thược Dược Tím',
    type: 'hoa',
    seedPrice: 35,
    growTime: 36183,
    growStages: [7202, 10515, 21132, 36183],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Thược Dược màu Tím.'
  },
  {
    id: 'hoa-96',
    icon: '🌻',
    name: 'Hoa Thược Dược Cam',
    type: 'hoa',
    seedPrice: 36,
    growTime: 34514,
    growStages: [13039, 15182, 28335, 34514],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Thược Dược màu Cam.'
  },
  {
    id: 'hoa-97',
    icon: '🌷',
    name: 'Hoa Thược Dược Xanh',
    type: 'hoa',
    seedPrice: 37,
    growTime: 35139,
    growStages: [17050, 17873, 26814, 35139],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Thược Dược màu Xanh.'
  },
  {
    id: 'hoa-98',
    icon: '💐',
    name: 'Hoa Thược Dược Biếc',
    type: 'hoa',
    seedPrice: 38,
    growTime: 41153,
    growStages: [11579, 18769, 29308, 41153],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Thược Dược màu Biếc.'
  },
  {
    id: 'hoa-99',
    icon: '🏵️',
    name: 'Hoa Thược Dược Sọc',
    type: 'hoa',
    seedPrice: 39,
    growTime: 47488,
    growStages: [29647, 34868, 41059, 47488],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Thược Dược màu Sọc.'
  },
  {
    id: 'hoa-100',
    icon: '🧡',
    name: 'Hoa Thược Dược Đốm',
    type: 'hoa',
    seedPrice: 40,
    growTime: 47947,
    growStages: [18370, 24359, 38737, 47947],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Thược Dược màu Đốm.'
  },
  {
    id: 'hoa-101',
    icon: '💗',
    name: 'Hoa Cẩm Chướng Đỏ',
    type: 'hoa',
    seedPrice: 41,
    growTime: 39210,
    growStages: [14223, 21266, 34974, 39210],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Cẩm Chướng màu Đỏ.'
  },
  {
    id: 'hoa-102',
    icon: '🩷',
    name: 'Hoa Cẩm Chướng Vàng',
    type: 'hoa',
    seedPrice: 42,
    growTime: 54198,
    growStages: [24167, 28645, 33963, 54198],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Cẩm Chướng màu Vàng.'
  },
  {
    id: 'hoa-103',
    icon: '🟡',
    name: 'Hoa Cẩm Chướng Hồng',
    type: 'hoa',
    seedPrice: 43,
    growTime: 41384,
    growStages: [18352, 20361, 29190, 41384],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Cẩm Chướng màu Hồng.'
  },
  {
    id: 'hoa-104',
    icon: '⚪',
    name: 'Hoa Cẩm Chướng Trắng',
    type: 'hoa',
    seedPrice: 44,
    growTime: 15548,
    growStages: [4479, 5910, 7818, 15548],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Cẩm Chướng màu Trắng.'
  },
  {
    id: 'hoa-105',
    icon: '🌹',
    name: 'Hoa Cẩm Chướng Tím',
    type: 'hoa',
    seedPrice: 45,
    growTime: 34535,
    growStages: [5114, 6233, 13564, 34535],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Cẩm Chướng màu Tím.'
  },
  {
    id: 'hoa-106',
    icon: '🌼',
    name: 'Hoa Cẩm Chướng Cam',
    type: 'hoa',
    seedPrice: 46,
    growTime: 17543,
    growStages: [3970, 9410, 11598, 17543],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Cẩm Chướng màu Cam.'
  },
  {
    id: 'hoa-107',
    icon: '🌺',
    name: 'Hoa Cẩm Chướng Xanh',
    type: 'hoa',
    seedPrice: 47,
    growTime: 52897,
    growStages: [22088, 26801, 32297, 52897],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Cẩm Chướng màu Xanh.'
  },
  {
    id: 'hoa-108',
    icon: '🌸',
    name: 'Hoa Cẩm Chướng Biếc',
    type: 'hoa',
    seedPrice: 48,
    growTime: 52923,
    growStages: [30063, 34687, 42559, 52923],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Cẩm Chướng màu Biếc.'
  },
  {
    id: 'hoa-109',
    icon: '🪷',
    name: 'Hoa Cẩm Chướng Sọc',
    type: 'hoa',
    seedPrice: 49,
    growTime: 25089,
    growStages: [4033, 7257, 12339, 25089],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Cẩm Chướng màu Sọc.'
  },
  {
    id: 'hoa-110',
    icon: '💮',
    name: 'Hoa Cẩm Chướng Đốm',
    type: 'hoa',
    seedPrice: 50,
    growTime: 59951,
    growStages: [34705, 40439, 51718, 59951],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Cẩm Chướng màu Đốm.'
  },
  {
    id: 'hoa-111',
    icon: '🌻',
    name: 'Hoa Dã Quỳ Đỏ',
    type: 'hoa',
    seedPrice: 51,
    growTime: 54921,
    growStages: [29617, 34830, 41015, 54921],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Dã Quỳ màu Đỏ.'
  },
  {
    id: 'hoa-112',
    icon: '🌷',
    name: 'Hoa Dã Quỳ Vàng',
    type: 'hoa',
    seedPrice: 52,
    growTime: 55450,
    growStages: [27989, 34345, 34535, 55450],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Dã Quỳ màu Vàng.'
  },
  {
    id: 'hoa-113',
    icon: '💐',
    name: 'Hoa Dã Quỳ Hồng',
    type: 'hoa',
    seedPrice: 53,
    growTime: 41644,
    growStages: [6607, 12645, 21558, 41644],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Dã Quỳ màu Hồng.'
  },
  {
    id: 'hoa-114',
    icon: '🏵️',
    name: 'Hoa Dã Quỳ Trắng',
    type: 'hoa',
    seedPrice: 54,
    growTime: 48385,
    growStages: [37598, 38119, 45657, 48385],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Dã Quỳ màu Trắng.'
  },
  {
    id: 'hoa-115',
    icon: '🧡',
    name: 'Hoa Dã Quỳ Tím',
    type: 'hoa',
    seedPrice: 55,
    growTime: 26218,
    growStages: [23313, 24780, 26026, 26218],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Dã Quỳ màu Tím.'
  },
  {
    id: 'hoa-116',
    icon: '💗',
    name: 'Hoa Dã Quỳ Cam',
    type: 'hoa',
    seedPrice: 56,
    growTime: 31846,
    growStages: [5055, 12169, 16504, 31846],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Dã Quỳ màu Cam.'
  },
  {
    id: 'hoa-117',
    icon: '🩷',
    name: 'Hoa Dã Quỳ Xanh',
    type: 'hoa',
    seedPrice: 57,
    growTime: 47455,
    growStages: [29125, 29973, 33600, 47455],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Dã Quỳ màu Xanh.'
  },
  {
    id: 'hoa-118',
    icon: '🟡',
    name: 'Hoa Dã Quỳ Biếc',
    type: 'hoa',
    seedPrice: 58,
    growTime: 37941,
    growStages: [8424, 9256, 22376, 37941],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Dã Quỳ màu Biếc.'
  },
  {
    id: 'hoa-119',
    icon: '⚪',
    name: 'Hoa Dã Quỳ Sọc',
    type: 'hoa',
    seedPrice: 59,
    growTime: 58310,
    growStages: [39666, 45866, 46582, 58310],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Dã Quỳ màu Sọc.'
  },
  {
    id: 'hoa-120',
    icon: '🌹',
    name: 'Hoa Dã Quỳ Đốm',
    type: 'hoa',
    seedPrice: 60,
    growTime: 21236,
    growStages: [5319, 5920, 16394, 21236],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Dã Quỳ màu Đốm.'
  },
  {
    id: 'hoa-121',
    icon: '🌼',
    name: 'Hoa Vạn Thọ Đỏ',
    type: 'hoa',
    seedPrice: 61,
    growTime: 49702,
    growStages: [33041, 35508, 42561, 49702],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Vạn Thọ màu Đỏ.'
  },
  {
    id: 'hoa-122',
    icon: '🌺',
    name: 'Hoa Vạn Thọ Vàng',
    type: 'hoa',
    seedPrice: 62,
    growTime: 49567,
    growStages: [39487, 40261, 48841, 49567],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Vạn Thọ màu Vàng.'
  },
  {
    id: 'hoa-123',
    icon: '🌸',
    name: 'Hoa Vạn Thọ Hồng',
    type: 'hoa',
    seedPrice: 63,
    growTime: 38311,
    growStages: [27054, 28269, 36382, 38311],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Vạn Thọ màu Hồng.'
  },
  {
    id: 'hoa-124',
    icon: '🪷',
    name: 'Hoa Vạn Thọ Trắng',
    type: 'hoa',
    seedPrice: 64,
    growTime: 30827,
    growStages: [24906, 25816, 27573, 30827],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Vạn Thọ màu Trắng.'
  },
  {
    id: 'hoa-125',
    icon: '💮',
    name: 'Hoa Vạn Thọ Tím',
    type: 'hoa',
    seedPrice: 65,
    growTime: 53725,
    growStages: [36338, 37975, 38800, 53725],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Vạn Thọ màu Tím.'
  },
  {
    id: 'hoa-126',
    icon: '🌻',
    name: 'Hoa Vạn Thọ Cam',
    type: 'hoa',
    seedPrice: 66,
    growTime: 28023,
    growStages: [15632, 17709, 26116, 28023],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Vạn Thọ màu Cam.'
  },
  {
    id: 'hoa-127',
    icon: '🌷',
    name: 'Hoa Vạn Thọ Xanh',
    type: 'hoa',
    seedPrice: 67,
    growTime: 54143,
    growStages: [23083, 25241, 37241, 54143],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Vạn Thọ màu Xanh.'
  },
  {
    id: 'hoa-128',
    icon: '💐',
    name: 'Hoa Vạn Thọ Biếc',
    type: 'hoa',
    seedPrice: 68,
    growTime: 51464,
    growStages: [15983, 20378, 33935, 51464],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Vạn Thọ màu Biếc.'
  },
  {
    id: 'hoa-129',
    icon: '🏵️',
    name: 'Hoa Vạn Thọ Sọc',
    type: 'hoa',
    seedPrice: 69,
    growTime: 64939,
    growStages: [33501, 39158, 46771, 64939],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Vạn Thọ màu Sọc.'
  },
  {
    id: 'hoa-130',
    icon: '🧡',
    name: 'Hoa Vạn Thọ Đốm',
    type: 'hoa',
    seedPrice: 70,
    growTime: 54506,
    growStages: [28316, 28728, 33956, 54506],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Vạn Thọ màu Đốm.'
  },
  {
    id: 'hoa-131',
    icon: '💗',
    name: 'Hoa Đồng Tiền Đỏ',
    type: 'hoa',
    seedPrice: 71,
    growTime: 24225,
    growStages: [4774, 7306, 11606, 24225],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Đồng Tiền màu Đỏ.'
  },
  {
    id: 'hoa-132',
    icon: '🩷',
    name: 'Hoa Đồng Tiền Vàng',
    type: 'hoa',
    seedPrice: 72,
    growTime: 54869,
    growStages: [20591, 25193, 37987, 54869],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Đồng Tiền màu Vàng.'
  },
  {
    id: 'hoa-133',
    icon: '🟡',
    name: 'Hoa Đồng Tiền Hồng',
    type: 'hoa',
    seedPrice: 73,
    growTime: 44053,
    growStages: [12647, 15937, 27860, 44053],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Đồng Tiền màu Hồng.'
  },
  {
    id: 'hoa-134',
    icon: '⚪',
    name: 'Hoa Đồng Tiền Trắng',
    type: 'hoa',
    seedPrice: 74,
    growTime: 61465,
    growStages: [31639, 33310, 43458, 61465],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Đồng Tiền màu Trắng.'
  },
  {
    id: 'hoa-135',
    icon: '🌹',
    name: 'Hoa Đồng Tiền Tím',
    type: 'hoa',
    seedPrice: 75,
    growTime: 36321,
    growStages: [18498, 20811, 27632, 36321],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Đồng Tiền màu Tím.'
  },
  {
    id: 'hoa-136',
    icon: '🌼',
    name: 'Hoa Đồng Tiền Cam',
    type: 'hoa',
    seedPrice: 76,
    growTime: 37502,
    growStages: [3443, 8010, 17430, 37502],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Đồng Tiền màu Cam.'
  },
  {
    id: 'hoa-137',
    icon: '🌺',
    name: 'Hoa Đồng Tiền Xanh',
    type: 'hoa',
    seedPrice: 77,
    growTime: 51211,
    growStages: [26656, 31385, 43756, 51211],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Đồng Tiền màu Xanh.'
  },
  {
    id: 'hoa-138',
    icon: '🌸',
    name: 'Hoa Đồng Tiền Biếc',
    type: 'hoa',
    seedPrice: 78,
    growTime: 29712,
    growStages: [10795, 14107, 19158, 29712],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Đồng Tiền màu Biếc.'
  },
  {
    id: 'hoa-139',
    icon: '🪷',
    name: 'Hoa Đồng Tiền Sọc',
    type: 'hoa',
    seedPrice: 79,
    growTime: 30015,
    growStages: [25909, 28636, 29434, 30015],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Đồng Tiền màu Sọc.'
  },
  {
    id: 'hoa-140',
    icon: '💮',
    name: 'Hoa Đồng Tiền Đốm',
    type: 'hoa',
    seedPrice: 80,
    growTime: 34011,
    growStages: [4008, 4154, 17074, 34011],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Đồng Tiền màu Đốm.'
  },
  {
    id: 'hoa-141',
    icon: '🌻',
    name: 'Hoa Mười Giờ Đỏ',
    type: 'hoa',
    seedPrice: 81,
    growTime: 44504,
    growStages: [28162, 31017, 38991, 44504],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Mười Giờ màu Đỏ.'
  },
  {
    id: 'hoa-142',
    icon: '🌷',
    name: 'Hoa Mười Giờ Vàng',
    type: 'hoa',
    seedPrice: 82,
    growTime: 31371,
    growStages: [16677, 21692, 30065, 31371],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Mười Giờ màu Vàng.'
  },
  {
    id: 'hoa-143',
    icon: '💐',
    name: 'Hoa Mười Giờ Hồng',
    type: 'hoa',
    seedPrice: 83,
    growTime: 32988,
    growStages: [7405, 9056, 12480, 32988],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Mười Giờ màu Hồng.'
  },
  {
    id: 'hoa-144',
    icon: '🏵️',
    name: 'Hoa Mười Giờ Trắng',
    type: 'hoa',
    seedPrice: 84,
    growTime: 45751,
    growStages: [17166, 23912, 30868, 45751],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Mười Giờ màu Trắng.'
  },
  {
    id: 'hoa-145',
    icon: '🧡',
    name: 'Hoa Mười Giờ Tím',
    type: 'hoa',
    seedPrice: 85,
    growTime: 50657,
    growStages: [13819, 17216, 29123, 50657],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Mười Giờ màu Tím.'
  },
  {
    id: 'hoa-146',
    icon: '💗',
    name: 'Hoa Mười Giờ Cam',
    type: 'hoa',
    seedPrice: 86,
    growTime: 58458,
    growStages: [33268, 35370, 47403, 58458],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Mười Giờ màu Cam.'
  },
  {
    id: 'hoa-147',
    icon: '🩷',
    name: 'Hoa Mười Giờ Xanh',
    type: 'hoa',
    seedPrice: 87,
    growTime: 61573,
    growStages: [42212, 44698, 54969, 61573],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Mười Giờ màu Xanh.'
  },
  {
    id: 'hoa-148',
    icon: '🟡',
    name: 'Hoa Mười Giờ Biếc',
    type: 'hoa',
    seedPrice: 88,
    growTime: 42425,
    growStages: [15927, 18752, 21042, 42425],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Mười Giờ màu Biếc.'
  },
  {
    id: 'hoa-149',
    icon: '⚪',
    name: 'Hoa Mười Giờ Sọc',
    type: 'hoa',
    seedPrice: 89,
    growTime: 72322,
    growStages: [40206, 46757, 54501, 72322],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Mười Giờ màu Sọc.'
  },
  {
    id: 'hoa-150',
    icon: '🌹',
    name: 'Hoa Mười Giờ Đốm',
    type: 'hoa',
    seedPrice: 90,
    growTime: 45713,
    growStages: [19113, 24442, 31698, 45713],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Mười Giờ màu Đốm.'
  },
  {
    id: 'hoa-151',
    icon: '🌼',
    name: 'Hoa Súng Đỏ',
    type: 'hoa',
    seedPrice: 91,
    growTime: 21612,
    growStages: [6384, 9873, 12417, 21612],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Súng màu Đỏ.'
  },
  {
    id: 'hoa-152',
    icon: '🌺',
    name: 'Hoa Súng Vàng',
    type: 'hoa',
    seedPrice: 92,
    growTime: 43633,
    growStages: [24257, 31177, 42259, 43633],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Súng màu Vàng.'
  },
  {
    id: 'hoa-153',
    icon: '🌸',
    name: 'Hoa Súng Hồng',
    type: 'hoa',
    seedPrice: 93,
    growTime: 45120,
    growStages: [34208, 40538, 40904, 45120],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Súng màu Hồng.'
  },
  {
    id: 'hoa-154',
    icon: '🪷',
    name: 'Hoa Súng Trắng',
    type: 'hoa',
    seedPrice: 94,
    growTime: 59895,
    growStages: [42538, 46984, 49049, 59895],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Súng màu Trắng.'
  },
  {
    id: 'hoa-155',
    icon: '💮',
    name: 'Hoa Súng Tím',
    type: 'hoa',
    seedPrice: 95,
    growTime: 57736,
    growStages: [39026, 45614, 52422, 57736],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Súng màu Tím.'
  },
  {
    id: 'hoa-156',
    icon: '🌻',
    name: 'Hoa Súng Cam',
    type: 'hoa',
    seedPrice: 96,
    growTime: 31866,
    growStages: [16171, 20710, 27459, 31866],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Súng màu Cam.'
  },
  {
    id: 'hoa-157',
    icon: '🌷',
    name: 'Hoa Súng Xanh',
    type: 'hoa',
    seedPrice: 97,
    growTime: 59693,
    growStages: [39144, 41373, 51711, 59693],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Súng màu Xanh.'
  },
  {
    id: 'hoa-158',
    icon: '💐',
    name: 'Hoa Súng Biếc',
    type: 'hoa',
    seedPrice: 98,
    growTime: 33273,
    growStages: [22728, 22860, 26983, 33273],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Súng màu Biếc.'
  },
  {
    id: 'hoa-159',
    icon: '🏵️',
    name: 'Hoa Súng Sọc',
    type: 'hoa',
    seedPrice: 99,
    growTime: 33947,
    growStages: [10460, 11916, 17281, 33947],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Súng màu Sọc.'
  },
  {
    id: 'hoa-160',
    icon: '🧡',
    name: 'Hoa Súng Đốm',
    type: 'hoa',
    seedPrice: 20,
    growTime: 56994,
    growStages: [41996, 43506, 52384, 56994],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Súng màu Đốm.'
  },
  {
    id: 'hoa-161',
    icon: '💗',
    name: 'Hoa Cẩm Tú Đỏ',
    type: 'hoa',
    seedPrice: 21,
    growTime: 55101,
    growStages: [37204, 40024, 40943, 55101],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Cẩm Tú màu Đỏ.'
  },
  {
    id: 'hoa-162',
    icon: '🩷',
    name: 'Hoa Cẩm Tú Vàng',
    type: 'hoa',
    seedPrice: 22,
    growTime: 30440,
    growStages: [10480, 12151, 26367, 30440],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Cẩm Tú màu Vàng.'
  },
  {
    id: 'hoa-163',
    icon: '🟡',
    name: 'Hoa Cẩm Tú Hồng',
    type: 'hoa',
    seedPrice: 23,
    growTime: 48898,
    growStages: [14144, 19254, 27632, 48898],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Cẩm Tú màu Hồng.'
  },
  {
    id: 'hoa-164',
    icon: '⚪',
    name: 'Hoa Cẩm Tú Trắng',
    type: 'hoa',
    seedPrice: 24,
    growTime: 43858,
    growStages: [20353, 22408, 23656, 43858],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Cẩm Tú màu Trắng.'
  },
  {
    id: 'hoa-165',
    icon: '🌹',
    name: 'Hoa Cẩm Tú Tím',
    type: 'hoa',
    seedPrice: 25,
    growTime: 27137,
    growStages: [4183, 5260, 15840, 27137],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Cẩm Tú màu Tím.'
  },
  {
    id: 'hoa-166',
    icon: '🌼',
    name: 'Hoa Cẩm Tú Cam',
    type: 'hoa',
    seedPrice: 26,
    growTime: 34901,
    growStages: [11770, 17508, 23248, 34901],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Cẩm Tú màu Cam.'
  },
  {
    id: 'hoa-167',
    icon: '🌺',
    name: 'Hoa Cẩm Tú Xanh',
    type: 'hoa',
    seedPrice: 27,
    growTime: 55688,
    growStages: [28979, 35762, 38199, 55688],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Cẩm Tú màu Xanh.'
  },
  {
    id: 'hoa-168',
    icon: '🌸',
    name: 'Hoa Cẩm Tú Biếc',
    type: 'hoa',
    seedPrice: 28,
    growTime: 21463,
    growStages: [7737, 11708, 15354, 21463],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Cẩm Tú màu Biếc.'
  },
  {
    id: 'hoa-169',
    icon: '🪷',
    name: 'Hoa Cẩm Tú Sọc',
    type: 'hoa',
    seedPrice: 29,
    growTime: 24084,
    growStages: [13597, 15972, 18009, 24084],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Cẩm Tú màu Sọc.'
  },
  {
    id: 'hoa-170',
    icon: '💮',
    name: 'Hoa Cẩm Tú Đốm',
    type: 'hoa',
    seedPrice: 30,
    growTime: 44791,
    growStages: [25844, 30183, 43530, 44791],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Cẩm Tú màu Đốm.'
  },
  {
    id: 'hoa-171',
    icon: '🌻',
    name: 'Hoa Mẫu Đơn Đỏ',
    type: 'hoa',
    seedPrice: 31,
    growTime: 62550,
    growStages: [31344, 35275, 49536, 62550],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Mẫu Đơn màu Đỏ.'
  },
  {
    id: 'hoa-172',
    icon: '🌷',
    name: 'Hoa Mẫu Đơn Vàng',
    type: 'hoa',
    seedPrice: 32,
    growTime: 34429,
    growStages: [7733, 10064, 15774, 34429],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Mẫu Đơn màu Vàng.'
  },
  {
    id: 'hoa-173',
    icon: '💐',
    name: 'Hoa Mẫu Đơn Hồng',
    type: 'hoa',
    seedPrice: 33,
    growTime: 51855,
    growStages: [38773, 41451, 46776, 51855],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Mẫu Đơn màu Hồng.'
  },
  {
    id: 'hoa-174',
    icon: '🏵️',
    name: 'Hoa Mẫu Đơn Trắng',
    type: 'hoa',
    seedPrice: 34,
    growTime: 51591,
    growStages: [39081, 44672, 46924, 51591],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Mẫu Đơn màu Trắng.'
  },
  {
    id: 'hoa-175',
    icon: '🧡',
    name: 'Hoa Mẫu Đơn Tím',
    type: 'hoa',
    seedPrice: 35,
    growTime: 24890,
    growStages: [166, 1357, 7210, 24890],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Mẫu Đơn màu Tím.'
  },
  {
    id: 'hoa-176',
    icon: '💗',
    name: 'Hoa Mẫu Đơn Cam',
    type: 'hoa',
    seedPrice: 36,
    growTime: 43767,
    growStages: [21411, 27307, 30669, 43767],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Mẫu Đơn màu Cam.'
  },
  {
    id: 'hoa-177',
    icon: '🩷',
    name: 'Hoa Mẫu Đơn Xanh',
    type: 'hoa',
    seedPrice: 37,
    growTime: 50458,
    growStages: [34743, 34874, 38552, 50458],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Mẫu Đơn màu Xanh.'
  },
  {
    id: 'hoa-178',
    icon: '🟡',
    name: 'Hoa Mẫu Đơn Biếc',
    type: 'hoa',
    seedPrice: 38,
    growTime: 66213,
    growStages: [41495, 43329, 55184, 66213],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Mẫu Đơn màu Biếc.'
  },
  {
    id: 'hoa-179',
    icon: '⚪',
    name: 'Hoa Mẫu Đơn Sọc',
    type: 'hoa',
    seedPrice: 39,
    growTime: 43435,
    growStages: [27286, 31368, 40642, 43435],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Mẫu Đơn màu Sọc.'
  },
  {
    id: 'hoa-180',
    icon: '🌹',
    name: 'Hoa Mẫu Đơn Đốm',
    type: 'hoa',
    seedPrice: 40,
    growTime: 28371,
    growStages: [10297, 14627, 26605, 28371],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Mẫu Đơn màu Đốm.'
  },
  {
    id: 'hoa-181',
    icon: '🌼',
    name: 'Hoa Hướng Dương Đỏ',
    type: 'hoa',
    seedPrice: 41,
    growTime: 21327,
    growStages: [3254, 5506, 6049, 21327],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Hướng Dương màu Đỏ.'
  },
  {
    id: 'hoa-182',
    icon: '🌺',
    name: 'Hoa Hướng Dương Vàng',
    type: 'hoa',
    seedPrice: 42,
    growTime: 19979,
    growStages: [283, 6576, 12198, 19979],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Hướng Dương màu Vàng.'
  },
  {
    id: 'hoa-183',
    icon: '🌸',
    name: 'Hoa Hướng Dương Hồng',
    type: 'hoa',
    seedPrice: 43,
    growTime: 29541,
    growStages: [12070, 15595, 28894, 29541],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Hướng Dương màu Hồng.'
  },
  {
    id: 'hoa-184',
    icon: '🪷',
    name: 'Hoa Hướng Dương Trắng',
    type: 'hoa',
    seedPrice: 44,
    growTime: 51784,
    growStages: [28293, 33748, 45857, 51784],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Hướng Dương màu Trắng.'
  },
  {
    id: 'hoa-185',
    icon: '💮',
    name: 'Hoa Hướng Dương Tím',
    type: 'hoa',
    seedPrice: 45,
    growTime: 39594,
    growStages: [11807, 18773, 28890, 39594],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Hướng Dương màu Tím.'
  },
  {
    id: 'hoa-186',
    icon: '🌻',
    name: 'Hoa Hướng Dương Cam',
    type: 'hoa',
    seedPrice: 46,
    growTime: 60837,
    growStages: [37465, 44601, 54858, 60837],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Hướng Dương màu Cam.'
  },
  {
    id: 'hoa-187',
    icon: '🌷',
    name: 'Hoa Hướng Dương Xanh',
    type: 'hoa',
    seedPrice: 47,
    growTime: 51641,
    growStages: [25701, 27943, 30673, 51641],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Hướng Dương màu Xanh.'
  },
  {
    id: 'hoa-188',
    icon: '💐',
    name: 'Hoa Hướng Dương Biếc',
    type: 'hoa',
    seedPrice: 48,
    growTime: 73673,
    growStages: [42742, 46261, 58695, 73673],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Hướng Dương màu Biếc.'
  },
  {
    id: 'hoa-189',
    icon: '🏵️',
    name: 'Hoa Hướng Dương Sọc',
    type: 'hoa',
    seedPrice: 49,
    growTime: 20962,
    growStages: [2962, 9432, 9841, 20962],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Hướng Dương màu Sọc.'
  },
  {
    id: 'hoa-190',
    icon: '🧡',
    name: 'Hoa Hướng Dương Đốm',
    type: 'hoa',
    seedPrice: 50,
    growTime: 55403,
    growStages: [30450, 35995, 44094, 55403],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Hướng Dương màu Đốm.'
  },
  {
    id: 'hoa-191',
    icon: '💗',
    name: 'Hoa Tulip Đỏ',
    type: 'hoa',
    seedPrice: 51,
    growTime: 38232,
    growStages: [12214, 17338, 31417, 38232],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Tulip màu Đỏ.'
  },
  {
    id: 'hoa-192',
    icon: '🩷',
    name: 'Hoa Tulip Vàng',
    type: 'hoa',
    seedPrice: 52,
    growTime: 18987,
    growStages: [4722, 8358, 15338, 18987],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Tulip màu Vàng.'
  },
  {
    id: 'hoa-193',
    icon: '🟡',
    name: 'Hoa Tulip Hồng',
    type: 'hoa',
    seedPrice: 53,
    growTime: 69550,
    growStages: [38680, 40678, 51465, 69550],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Tulip màu Hồng.'
  },
  {
    id: 'hoa-194',
    icon: '⚪',
    name: 'Hoa Tulip Trắng',
    type: 'hoa',
    seedPrice: 54,
    growTime: 20814,
    growStages: [13606, 16029, 17922, 20814],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Tulip màu Trắng.'
  },
  {
    id: 'hoa-195',
    icon: '🌹',
    name: 'Hoa Tulip Tím',
    type: 'hoa',
    seedPrice: 55,
    growTime: 67994,
    growStages: [39369, 42526, 53653, 67994],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Tulip màu Tím.'
  },
  {
    id: 'hoa-196',
    icon: '🌼',
    name: 'Hoa Tulip Cam',
    type: 'hoa',
    seedPrice: 56,
    growTime: 61904,
    growStages: [36236, 36520, 50798, 61904],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Tulip màu Cam.'
  },
  {
    id: 'hoa-197',
    icon: '🌺',
    name: 'Hoa Tulip Xanh',
    type: 'hoa',
    seedPrice: 57,
    growTime: 49812,
    growStages: [24452, 26859, 30097, 49812],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Tulip màu Xanh.'
  },
  {
    id: 'hoa-198',
    icon: '🌸',
    name: 'Hoa Tulip Biếc',
    type: 'hoa',
    seedPrice: 58,
    growTime: 37391,
    growStages: [28794, 31042, 34281, 37391],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Tulip màu Biếc.'
  },
  {
    id: 'hoa-199',
    icon: '🪷',
    name: 'Hoa Tulip Sọc',
    type: 'hoa',
    seedPrice: 59,
    growTime: 51224,
    growStages: [23513, 25135, 30728, 51224],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Tulip màu Sọc.'
  },
  {
    id: 'hoa-200',
    icon: '💮',
    name: 'Hoa Tulip Đốm',
    type: 'hoa',
    seedPrice: 60,
    growTime: 61820,
    growStages: [28022, 35096, 46562, 61820],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Tulip màu Đốm.'
  },
  {
    id: 'hoa-201',
    icon: '🌻',
    name: 'Hoa Lavender Đỏ',
    type: 'hoa',
    seedPrice: 61,
    growTime: 27903,
    growStages: [2770, 9057, 10907, 27903],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Lavender màu Đỏ.'
  },
  {
    id: 'hoa-202',
    icon: '🌷',
    name: 'Hoa Lavender Vàng',
    type: 'hoa',
    seedPrice: 62,
    growTime: 47551,
    growStages: [16231, 16503, 29613, 47551],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Lavender màu Vàng.'
  },
  {
    id: 'hoa-203',
    icon: '💐',
    name: 'Hoa Lavender Hồng',
    type: 'hoa',
    seedPrice: 63,
    growTime: 25737,
    growStages: [6140, 12555, 23206, 25737],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Lavender màu Hồng.'
  },
  {
    id: 'hoa-204',
    icon: '🏵️',
    name: 'Hoa Lavender Trắng',
    type: 'hoa',
    seedPrice: 64,
    growTime: 35057,
    growStages: [12969, 19331, 22902, 35057],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Lavender màu Trắng.'
  },
  {
    id: 'hoa-205',
    icon: '🧡',
    name: 'Hoa Lavender Tím',
    type: 'hoa',
    seedPrice: 65,
    growTime: 59996,
    growStages: [40662, 41835, 44885, 59996],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Lavender màu Tím.'
  },
  {
    id: 'hoa-206',
    icon: '💗',
    name: 'Hoa Lavender Cam',
    type: 'hoa',
    seedPrice: 66,
    growTime: 48627,
    growStages: [36155, 37642, 43546, 48627],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Lavender màu Cam.'
  },
  {
    id: 'hoa-207',
    icon: '🩷',
    name: 'Hoa Lavender Xanh',
    type: 'hoa',
    seedPrice: 67,
    growTime: 33255,
    growStages: [1369, 6726, 18601, 33255],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Lavender màu Xanh.'
  },
  {
    id: 'hoa-208',
    icon: '🟡',
    name: 'Hoa Lavender Biếc',
    type: 'hoa',
    seedPrice: 68,
    growTime: 46790,
    growStages: [33371, 34254, 37924, 46790],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Lavender màu Biếc.'
  },
  {
    id: 'hoa-209',
    icon: '⚪',
    name: 'Hoa Lavender Sọc',
    type: 'hoa',
    seedPrice: 69,
    growTime: 37051,
    growStages: [7428, 14410, 27145, 37051],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Lavender màu Sọc.'
  },
  {
    id: 'hoa-210',
    icon: '🌹',
    name: 'Hoa Lavender Đốm',
    type: 'hoa',
    seedPrice: 70,
    growTime: 46898,
    growStages: [9885, 12545, 26552, 46898],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Lavender màu Đốm.'
  },
  {
    id: 'hoa-211',
    icon: '🌼',
    name: 'Hoa Hoa Nhài Đỏ',
    type: 'hoa',
    seedPrice: 71,
    growTime: 70825,
    growStages: [35821, 42220, 49890, 70825],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Hoa Nhài màu Đỏ.'
  },
  {
    id: 'hoa-212',
    icon: '🌺',
    name: 'Hoa Hoa Nhài Vàng',
    type: 'hoa',
    seedPrice: 72,
    growTime: 18647,
    growStages: [5022, 6259, 14235, 18647],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Hoa Nhài màu Vàng.'
  },
  {
    id: 'hoa-213',
    icon: '🌸',
    name: 'Hoa Hoa Nhài Hồng',
    type: 'hoa',
    seedPrice: 73,
    growTime: 20252,
    growStages: [10224, 10389, 17136, 20252],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Hoa Nhài màu Hồng.'
  },
  {
    id: 'hoa-214',
    icon: '🪷',
    name: 'Hoa Hoa Nhài Trắng',
    type: 'hoa',
    seedPrice: 74,
    growTime: 39891,
    growStages: [15854, 17960, 23857, 39891],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Hoa Nhài màu Trắng.'
  },
  {
    id: 'hoa-215',
    icon: '💮',
    name: 'Hoa Hoa Nhài Tím',
    type: 'hoa',
    seedPrice: 75,
    growTime: 26259,
    growStages: [6802, 7382, 7771, 26259],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Hoa Nhài màu Tím.'
  },
  {
    id: 'hoa-216',
    icon: '🌻',
    name: 'Hoa Hoa Nhài Cam',
    type: 'hoa',
    seedPrice: 76,
    growTime: 64393,
    growStages: [37849, 41136, 47501, 64393],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Hoa Nhài màu Cam.'
  },
  {
    id: 'hoa-217',
    icon: '🌷',
    name: 'Hoa Hoa Nhài Xanh',
    type: 'hoa',
    seedPrice: 77,
    growTime: 55538,
    growStages: [33201, 38363, 46019, 55538],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Hoa Nhài màu Xanh.'
  },
  {
    id: 'hoa-218',
    icon: '💐',
    name: 'Hoa Hoa Nhài Biếc',
    type: 'hoa',
    seedPrice: 78,
    growTime: 48874,
    growStages: [29253, 33823, 44292, 48874],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Hoa Nhài màu Biếc.'
  },
  {
    id: 'hoa-219',
    icon: '🏵️',
    name: 'Hoa Hoa Nhài Sọc',
    type: 'hoa',
    seedPrice: 79,
    growTime: 17040,
    growStages: [8521, 12243, 16677, 17040],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Hoa Nhài màu Sọc.'
  },
  {
    id: 'hoa-220',
    icon: '🧡',
    name: 'Hoa Hoa Nhài Đốm',
    type: 'hoa',
    seedPrice: 80,
    growTime: 34559,
    growStages: [2036, 6007, 16366, 34559],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Hoa Nhài màu Đốm.'
  },
  {
    id: 'hoa-221',
    icon: '💗',
    name: 'Hoa Hoa Sứ Đỏ',
    type: 'hoa',
    seedPrice: 81,
    growTime: 48727,
    growStages: [29101, 29836, 35642, 48727],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Hoa Sứ màu Đỏ.'
  },
  {
    id: 'hoa-222',
    icon: '🩷',
    name: 'Hoa Hoa Sứ Vàng',
    type: 'hoa',
    seedPrice: 82,
    growTime: 41106,
    growStages: [15332, 21814, 28943, 41106],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Hoa Sứ màu Vàng.'
  },
  {
    id: 'hoa-223',
    icon: '🟡',
    name: 'Hoa Hoa Sứ Hồng',
    type: 'hoa',
    seedPrice: 83,
    growTime: 52163,
    growStages: [30432, 30838, 31293, 52163],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Hoa Sứ màu Hồng.'
  },
  {
    id: 'hoa-224',
    icon: '⚪',
    name: 'Hoa Hoa Sứ Trắng',
    type: 'hoa',
    seedPrice: 84,
    growTime: 37076,
    growStages: [12440, 17299, 23304, 37076],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Hoa Sứ màu Trắng.'
  },
  {
    id: 'hoa-225',
    icon: '🌹',
    name: 'Hoa Hoa Sứ Tím',
    type: 'hoa',
    seedPrice: 85,
    growTime: 58776,
    growStages: [26631, 32839, 42673, 58776],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Hoa Sứ màu Tím.'
  },
  {
    id: 'hoa-226',
    icon: '🌼',
    name: 'Hoa Hoa Sứ Cam',
    type: 'hoa',
    seedPrice: 86,
    growTime: 34222,
    growStages: [11159, 14444, 22436, 34222],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Hoa Sứ màu Cam.'
  },
  {
    id: 'hoa-227',
    icon: '🌺',
    name: 'Hoa Hoa Sứ Xanh',
    type: 'hoa',
    seedPrice: 87,
    growTime: 49633,
    growStages: [27625, 30188, 30747, 49633],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Hoa Sứ màu Xanh.'
  },
  {
    id: 'hoa-228',
    icon: '🌸',
    name: 'Hoa Hoa Sứ Biếc',
    type: 'hoa',
    seedPrice: 88,
    growTime: 16858,
    growStages: [240, 3059, 10093, 16858],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Hoa Sứ màu Biếc.'
  },
  {
    id: 'hoa-229',
    icon: '🪷',
    name: 'Hoa Hoa Sứ Sọc',
    type: 'hoa',
    seedPrice: 89,
    growTime: 43850,
    growStages: [25643, 31189, 42641, 43850],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Hoa Sứ màu Sọc.'
  },
  {
    id: 'hoa-230',
    icon: '💮',
    name: 'Hoa Hoa Sứ Đốm',
    type: 'hoa',
    seedPrice: 90,
    growTime: 32894,
    growStages: [21956, 22321, 23230, 32894],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Hoa Sứ màu Đốm.'
  },
  {
    id: 'hoa-231',
    icon: '🌻',
    name: 'Hoa Bằng Lăng Đỏ',
    type: 'hoa',
    seedPrice: 91,
    growTime: 73311,
    growStages: [35398, 38298, 52656, 73311],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Bằng Lăng màu Đỏ.'
  },
  {
    id: 'hoa-232',
    icon: '🌷',
    name: 'Hoa Bằng Lăng Vàng',
    type: 'hoa',
    seedPrice: 92,
    growTime: 49442,
    growStages: [41482, 43806, 46083, 49442],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Bằng Lăng màu Vàng.'
  },
  {
    id: 'hoa-233',
    icon: '💐',
    name: 'Hoa Bằng Lăng Hồng',
    type: 'hoa',
    seedPrice: 93,
    growTime: 23412,
    growStages: [7074, 10636, 12679, 23412],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Bằng Lăng màu Hồng.'
  },
  {
    id: 'hoa-234',
    icon: '🏵️',
    name: 'Hoa Bằng Lăng Trắng',
    type: 'hoa',
    seedPrice: 94,
    growTime: 55247,
    growStages: [26240, 32570, 40472, 55247],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Bằng Lăng màu Trắng.'
  },
  {
    id: 'hoa-235',
    icon: '🧡',
    name: 'Hoa Bằng Lăng Tím',
    type: 'hoa',
    seedPrice: 95,
    growTime: 38419,
    growStages: [9771, 11045, 17328, 38419],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Bằng Lăng màu Tím.'
  },
  {
    id: 'hoa-236',
    icon: '💗',
    name: 'Hoa Bằng Lăng Cam',
    type: 'hoa',
    seedPrice: 96,
    growTime: 63265,
    growStages: [39325, 41930, 42207, 63265],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Bằng Lăng màu Cam.'
  },
  {
    id: 'hoa-237',
    icon: '🩷',
    name: 'Hoa Bằng Lăng Xanh',
    type: 'hoa',
    seedPrice: 97,
    growTime: 61147,
    growStages: [32804, 35940, 40595, 61147],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Bằng Lăng màu Xanh.'
  },
  {
    id: 'hoa-238',
    icon: '🟡',
    name: 'Hoa Bằng Lăng Biếc',
    type: 'hoa',
    seedPrice: 98,
    growTime: 28299,
    growStages: [7283, 7828, 17845, 28299],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Bằng Lăng màu Biếc.'
  },
  {
    id: 'hoa-239',
    icon: '⚪',
    name: 'Hoa Bằng Lăng Sọc',
    type: 'hoa',
    seedPrice: 99,
    growTime: 28110,
    growStages: [5404, 12579, 22294, 28110],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Bằng Lăng màu Sọc.'
  },
  {
    id: 'hoa-240',
    icon: '🌹',
    name: 'Hoa Bằng Lăng Đốm',
    type: 'hoa',
    seedPrice: 20,
    growTime: 48601,
    growStages: [22750, 26211, 38378, 48601],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Bằng Lăng màu Đốm.'
  },
  {
    id: 'hoa-241',
    icon: '🌼',
    name: 'Hoa Phượng Đỏ',
    type: 'hoa',
    seedPrice: 21,
    growTime: 28484,
    growStages: [13487, 16102, 28147, 28484],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Phượng màu Đỏ.'
  },
  {
    id: 'hoa-242',
    icon: '🌺',
    name: 'Hoa Phượng Vàng',
    type: 'hoa',
    seedPrice: 22,
    growTime: 31148,
    growStages: [12192, 14332, 24018, 31148],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Phượng màu Vàng.'
  },
  {
    id: 'hoa-243',
    icon: '🌸',
    name: 'Hoa Phượng Hồng',
    type: 'hoa',
    seedPrice: 23,
    growTime: 61503,
    growStages: [35469, 41932, 42569, 61503],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Phượng màu Hồng.'
  },
  {
    id: 'hoa-244',
    icon: '🪷',
    name: 'Hoa Phượng Trắng',
    type: 'hoa',
    seedPrice: 24,
    growTime: 38782,
    growStages: [9186, 15899, 28245, 38782],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Phượng màu Trắng.'
  },
  {
    id: 'hoa-245',
    icon: '💮',
    name: 'Hoa Phượng Tím',
    type: 'hoa',
    seedPrice: 25,
    growTime: 45646,
    growStages: [26566, 31612, 36080, 45646],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Phượng màu Tím.'
  },
  {
    id: 'hoa-246',
    icon: '🌻',
    name: 'Hoa Phượng Cam',
    type: 'hoa',
    seedPrice: 26,
    growTime: 30891,
    growStages: [20791, 23105, 30628, 30891],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Phượng màu Cam.'
  },
  {
    id: 'hoa-247',
    icon: '🌷',
    name: 'Hoa Phượng Xanh',
    type: 'hoa',
    seedPrice: 27,
    growTime: 44956,
    growStages: [25963, 33050, 42273, 44956],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Phượng màu Xanh.'
  },
  {
    id: 'hoa-248',
    icon: '💐',
    name: 'Hoa Phượng Biếc',
    type: 'hoa',
    seedPrice: 28,
    growTime: 36621,
    growStages: [5846, 10461, 19013, 36621],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Phượng màu Biếc.'
  },
  {
    id: 'hoa-249',
    icon: '🏵️',
    name: 'Hoa Phượng Sọc',
    type: 'hoa',
    seedPrice: 29,
    growTime: 17916,
    growStages: [2543, 5345, 16197, 17916],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Phượng màu Sọc.'
  },
  {
    id: 'hoa-250',
    icon: '🧡',
    name: 'Hoa Phượng Đốm',
    type: 'hoa',
    seedPrice: 30,
    growTime: 50060,
    growStages: [12722, 19911, 30078, 50060],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Phượng màu Đốm.'
  },
  {
    id: 'hoa-251',
    icon: '💗',
    name: 'Hoa Hoa Giấy Đỏ',
    type: 'hoa',
    seedPrice: 31,
    growTime: 44913,
    growStages: [33246, 33594, 36956, 44913],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Hoa Giấy màu Đỏ.'
  },
  {
    id: 'hoa-252',
    icon: '🩷',
    name: 'Hoa Hoa Giấy Vàng',
    type: 'hoa',
    seedPrice: 32,
    growTime: 56027,
    growStages: [28624, 31430, 36034, 56027],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Hoa Giấy màu Vàng.'
  },
  {
    id: 'hoa-253',
    icon: '🟡',
    name: 'Hoa Hoa Giấy Hồng',
    type: 'hoa',
    seedPrice: 33,
    growTime: 23703,
    growStages: [3184, 7712, 20307, 23703],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Hoa Giấy màu Hồng.'
  },
  {
    id: 'hoa-254',
    icon: '⚪',
    name: 'Hoa Hoa Giấy Trắng',
    type: 'hoa',
    seedPrice: 34,
    growTime: 32025,
    growStages: [10823, 15261, 19889, 32025],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Hoa Giấy màu Trắng.'
  },
  {
    id: 'hoa-255',
    icon: '🌹',
    name: 'Hoa Hoa Giấy Tím',
    type: 'hoa',
    seedPrice: 35,
    growTime: 49580,
    growStages: [39542, 41485, 47202, 49580],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Hoa Giấy màu Tím.'
  },
  {
    id: 'hoa-256',
    icon: '🌼',
    name: 'Hoa Hoa Giấy Cam',
    type: 'hoa',
    seedPrice: 36,
    growTime: 36488,
    growStages: [18392, 22065, 26400, 36488],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Hoa Giấy màu Cam.'
  },
  {
    id: 'hoa-257',
    icon: '🌺',
    name: 'Hoa Hoa Giấy Xanh',
    type: 'hoa',
    seedPrice: 37,
    growTime: 31668,
    growStages: [18946, 23770, 26150, 31668],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Hoa Giấy màu Xanh.'
  },
  {
    id: 'hoa-258',
    icon: '🌸',
    name: 'Hoa Hoa Giấy Biếc',
    type: 'hoa',
    seedPrice: 38,
    growTime: 32605,
    growStages: [28716, 29238, 31499, 32605],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Hoa Giấy màu Biếc.'
  },
  {
    id: 'hoa-259',
    icon: '🪷',
    name: 'Hoa Hoa Giấy Sọc',
    type: 'hoa',
    seedPrice: 39,
    growTime: 31767,
    growStages: [4712, 8569, 11457, 31767],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Hoa Giấy màu Sọc.'
  },
  {
    id: 'hoa-260',
    icon: '💮',
    name: 'Hoa Hoa Giấy Đốm',
    type: 'hoa',
    seedPrice: 40,
    growTime: 48846,
    growStages: [15919, 22041, 35730, 48846],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Hoa Giấy màu Đốm.'
  },
  {
    id: 'hoa-261',
    icon: '🌻',
    name: 'Hoa Trà My Đỏ',
    type: 'hoa',
    seedPrice: 41,
    growTime: 20516,
    growStages: [2844, 7081, 14514, 20516],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Trà My màu Đỏ.'
  },
  {
    id: 'hoa-262',
    icon: '🌷',
    name: 'Hoa Trà My Vàng',
    type: 'hoa',
    seedPrice: 42,
    growTime: 50142,
    growStages: [29682, 34572, 40763, 50142],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Trà My màu Vàng.'
  },
  {
    id: 'hoa-263',
    icon: '💐',
    name: 'Hoa Trà My Hồng',
    type: 'hoa',
    seedPrice: 43,
    growTime: 41383,
    growStages: [19155, 23322, 27208, 41383],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Trà My màu Hồng.'
  },
  {
    id: 'hoa-264',
    icon: '🏵️',
    name: 'Hoa Trà My Trắng',
    type: 'hoa',
    seedPrice: 44,
    growTime: 26854,
    growStages: [2795, 5155, 6688, 26854],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Trà My màu Trắng.'
  },
  {
    id: 'hoa-265',
    icon: '🧡',
    name: 'Hoa Trà My Tím',
    type: 'hoa',
    seedPrice: 45,
    growTime: 69373,
    growStages: [38663, 45798, 59195, 69373],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Trà My màu Tím.'
  },
  {
    id: 'hoa-266',
    icon: '💗',
    name: 'Hoa Trà My Cam',
    type: 'hoa',
    seedPrice: 46,
    growTime: 18549,
    growStages: [4562, 5859, 8872, 18549],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Trà My màu Cam.'
  },
  {
    id: 'hoa-267',
    icon: '🩷',
    name: 'Hoa Trà My Xanh',
    type: 'hoa',
    seedPrice: 47,
    growTime: 16573,
    growStages: [953, 5412, 15492, 16573],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Trà My màu Xanh.'
  },
  {
    id: 'hoa-268',
    icon: '🟡',
    name: 'Hoa Trà My Biếc',
    type: 'hoa',
    seedPrice: 48,
    growTime: 12554,
    growStages: [3022, 4383, 10304, 12554],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Trà My màu Biếc.'
  },
  {
    id: 'hoa-269',
    icon: '⚪',
    name: 'Hoa Trà My Sọc',
    type: 'hoa',
    seedPrice: 49,
    growTime: 63719,
    growStages: [39196, 42621, 51558, 63719],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Trà My màu Sọc.'
  },
  {
    id: 'hoa-270',
    icon: '🌹',
    name: 'Hoa Trà My Đốm',
    type: 'hoa',
    seedPrice: 50,
    growTime: 24127,
    growStages: [9894, 11007, 12276, 24127],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Trà My màu Đốm.'
  },
  {
    id: 'hoa-271',
    icon: '🌼',
    name: 'Hoa Hải Đường Đỏ',
    type: 'hoa',
    seedPrice: 51,
    growTime: 27136,
    growStages: [1796, 3309, 11445, 27136],
    yield: 2,
    sellPrice: 21,
    xp: 3,
    desc: 'Giống hoa Hải Đường màu Đỏ.'
  },
  {
    id: 'hoa-272',
    icon: '🌺',
    name: 'Hoa Hải Đường Vàng',
    type: 'hoa',
    seedPrice: 52,
    growTime: 43482,
    growStages: [22424, 26252, 39259, 43482],
    yield: 3,
    sellPrice: 22,
    xp: 4,
    desc: 'Giống hoa Hải Đường màu Vàng.'
  },
  {
    id: 'hoa-273',
    icon: '🌸',
    name: 'Hoa Hải Đường Hồng',
    type: 'hoa',
    seedPrice: 53,
    growTime: 70681,
    growStages: [39191, 40134, 54296, 70681],
    yield: 4,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống hoa Hải Đường màu Hồng.'
  },
  {
    id: 'hoa-274',
    icon: '🪷',
    name: 'Hoa Hải Đường Trắng',
    type: 'hoa',
    seedPrice: 54,
    growTime: 49878,
    growStages: [15121, 21562, 28438, 49878],
    yield: 5,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống hoa Hải Đường màu Trắng.'
  },
  {
    id: 'hoa-275',
    icon: '💮',
    name: 'Hoa Hải Đường Tím',
    type: 'hoa',
    seedPrice: 55,
    growTime: 58459,
    growStages: [37958, 39875, 42527, 58459],
    yield: 1,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống hoa Hải Đường màu Tím.'
  },
  {
    id: 'hoa-276',
    icon: '🌻',
    name: 'Hoa Hải Đường Cam',
    type: 'hoa',
    seedPrice: 56,
    growTime: 33067,
    growStages: [28038, 28531, 32325, 33067],
    yield: 2,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống hoa Hải Đường màu Cam.'
  },
  {
    id: 'hoa-277',
    icon: '🌷',
    name: 'Hoa Hải Đường Xanh',
    type: 'hoa',
    seedPrice: 57,
    growTime: 51692,
    growStages: [24300, 29057, 31632, 51692],
    yield: 3,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống hoa Hải Đường màu Xanh.'
  },
  {
    id: 'hoa-278',
    icon: '💐',
    name: 'Hoa Hải Đường Biếc',
    type: 'hoa',
    seedPrice: 58,
    growTime: 34595,
    growStages: [13635, 20024, 24084, 34595],
    yield: 4,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống hoa Hải Đường màu Biếc.'
  },
  {
    id: 'hoa-279',
    icon: '🏵️',
    name: 'Hoa Hải Đường Sọc',
    type: 'hoa',
    seedPrice: 59,
    growTime: 42918,
    growStages: [19992, 22418, 23156, 42918],
    yield: 5,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống hoa Hải Đường màu Sọc.'
  },
  {
    id: 'hoa-280',
    icon: '🧡',
    name: 'Hoa Hải Đường Đốm',
    type: 'hoa',
    seedPrice: 60,
    growTime: 62095,
    growStages: [37413, 38672, 44187, 62095],
    yield: 1,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống hoa Hải Đường màu Đốm.'
  },
  {
    id: 'hoa-281',
    icon: '💗',
    name: 'Hoa Tử Đằng Đỏ',
    type: 'hoa',
    seedPrice: 61,
    growTime: 42372,
    growStages: [22151, 28810, 29427, 42372],
    yield: 2,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống hoa Tử Đằng màu Đỏ.'
  },
  {
    id: 'hoa-282',
    icon: '🩷',
    name: 'Hoa Tử Đằng Vàng',
    type: 'hoa',
    seedPrice: 62,
    growTime: 36980,
    growStages: [8395, 15095, 18352, 36980],
    yield: 3,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống hoa Tử Đằng màu Vàng.'
  },
  {
    id: 'hoa-283',
    icon: '🟡',
    name: 'Hoa Tử Đằng Hồng',
    type: 'hoa',
    seedPrice: 63,
    growTime: 67489,
    growStages: [35759, 36319, 47218, 67489],
    yield: 4,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống hoa Tử Đằng màu Hồng.'
  },
  {
    id: 'hoa-284',
    icon: '⚪',
    name: 'Hoa Tử Đằng Trắng',
    type: 'hoa',
    seedPrice: 64,
    growTime: 56017,
    growStages: [29628, 31728, 37539, 56017],
    yield: 5,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống hoa Tử Đằng màu Trắng.'
  },
  {
    id: 'hoa-285',
    icon: '🌹',
    name: 'Hoa Tử Đằng Tím',
    type: 'hoa',
    seedPrice: 65,
    growTime: 20900,
    growStages: [10155, 17332, 20113, 20900],
    yield: 1,
    sellPrice: 35,
    xp: 2,
    desc: 'Giống hoa Tử Đằng màu Tím.'
  },
  {
    id: 'hoa-286',
    icon: '🌼',
    name: 'Hoa Tử Đằng Cam',
    type: 'hoa',
    seedPrice: 66,
    growTime: 48600,
    growStages: [39894, 41812, 45679, 48600],
    yield: 2,
    sellPrice: 36,
    xp: 3,
    desc: 'Giống hoa Tử Đằng màu Cam.'
  },
  {
    id: 'hoa-287',
    icon: '🌺',
    name: 'Hoa Tử Đằng Xanh',
    type: 'hoa',
    seedPrice: 67,
    growTime: 47994,
    growStages: [18390, 21860, 27302, 47994],
    yield: 3,
    sellPrice: 37,
    xp: 4,
    desc: 'Giống hoa Tử Đằng màu Xanh.'
  },
  {
    id: 'hoa-288',
    icon: '🌸',
    name: 'Hoa Tử Đằng Biếc',
    type: 'hoa',
    seedPrice: 68,
    growTime: 63239,
    growStages: [29107, 35760, 47743, 63239],
    yield: 4,
    sellPrice: 38,
    xp: 5,
    desc: 'Giống hoa Tử Đằng màu Biếc.'
  },
  {
    id: 'hoa-289',
    icon: '🪷',
    name: 'Hoa Tử Đằng Sọc',
    type: 'hoa',
    seedPrice: 69,
    growTime: 50699,
    growStages: [32479, 32715, 43734, 50699],
    yield: 5,
    sellPrice: 39,
    xp: 6,
    desc: 'Giống hoa Tử Đằng màu Sọc.'
  },
  {
    id: 'hoa-290',
    icon: '💮',
    name: 'Hoa Tử Đằng Đốm',
    type: 'hoa',
    seedPrice: 70,
    growTime: 34141,
    growStages: [7659, 13897, 21570, 34141],
    yield: 1,
    sellPrice: 40,
    xp: 7,
    desc: 'Giống hoa Tử Đằng màu Đốm.'
  },
  {
    id: 'hoa-291',
    icon: '🌻',
    name: 'Hoa Hoa Lài Đỏ',
    type: 'hoa',
    seedPrice: 71,
    growTime: 60634,
    growStages: [32654, 38957, 44427, 60634],
    yield: 2,
    sellPrice: 41,
    xp: 8,
    desc: 'Giống hoa Hoa Lài màu Đỏ.'
  },
  {
    id: 'hoa-292',
    icon: '🌷',
    name: 'Hoa Hoa Lài Vàng',
    type: 'hoa',
    seedPrice: 72,
    growTime: 52785,
    growStages: [35734, 36437, 45374, 52785],
    yield: 3,
    sellPrice: 42,
    xp: 9,
    desc: 'Giống hoa Hoa Lài màu Vàng.'
  },
  {
    id: 'hoa-293',
    icon: '💐',
    name: 'Hoa Hoa Lài Hồng',
    type: 'hoa',
    seedPrice: 73,
    growTime: 34002,
    growStages: [12576, 15714, 18755, 34002],
    yield: 4,
    sellPrice: 43,
    xp: 10,
    desc: 'Giống hoa Hoa Lài màu Hồng.'
  },
  {
    id: 'hoa-294',
    icon: '🏵️',
    name: 'Hoa Hoa Lài Trắng',
    type: 'hoa',
    seedPrice: 74,
    growTime: 32061,
    growStages: [8854, 10452, 16693, 32061],
    yield: 5,
    sellPrice: 44,
    xp: 11,
    desc: 'Giống hoa Hoa Lài màu Trắng.'
  },
  {
    id: 'hoa-295',
    icon: '🧡',
    name: 'Hoa Hoa Lài Tím',
    type: 'hoa',
    seedPrice: 75,
    growTime: 20980,
    growStages: [15900, 18135, 19950, 20980],
    yield: 1,
    sellPrice: 45,
    xp: 12,
    desc: 'Giống hoa Hoa Lài màu Tím.'
  },
  {
    id: 'hoa-296',
    icon: '💗',
    name: 'Hoa Hoa Lài Cam',
    type: 'hoa',
    seedPrice: 76,
    growTime: 66871,
    growStages: [39349, 43339, 50917, 66871],
    yield: 2,
    sellPrice: 46,
    xp: 13,
    desc: 'Giống hoa Hoa Lài màu Cam.'
  },
  {
    id: 'hoa-297',
    icon: '🩷',
    name: 'Hoa Hoa Lài Xanh',
    type: 'hoa',
    seedPrice: 77,
    growTime: 60184,
    growStages: [24681, 28853, 40470, 60184],
    yield: 3,
    sellPrice: 47,
    xp: 14,
    desc: 'Giống hoa Hoa Lài màu Xanh.'
  },
  {
    id: 'hoa-298',
    icon: '🟡',
    name: 'Hoa Hoa Lài Biếc',
    type: 'hoa',
    seedPrice: 78,
    growTime: 51566,
    growStages: [19520, 21816, 33166, 51566],
    yield: 4,
    sellPrice: 48,
    xp: 15,
    desc: 'Giống hoa Hoa Lài màu Biếc.'
  },
  {
    id: 'hoa-299',
    icon: '⚪',
    name: 'Hoa Hoa Lài Sọc',
    type: 'hoa',
    seedPrice: 79,
    growTime: 35018,
    growStages: [19537, 19654, 21783, 35018],
    yield: 5,
    sellPrice: 49,
    xp: 16,
    desc: 'Giống hoa Hoa Lài màu Sọc.'
  },
  {
    id: 'hoa-300',
    icon: '🌹',
    name: 'Hoa Hoa Lài Đốm',
    type: 'hoa',
    seedPrice: 80,
    growTime: 61755,
    growStages: [32561, 36864, 40161, 61755],
    yield: 1,
    sellPrice: 20,
    xp: 2,
    desc: 'Giống hoa Hoa Lài màu Đốm.'
  },
  {
    id: 'qua-1',
    icon: '🍎',
    name: 'Cam Nam',
    type: 'qua',
    seedPrice: 41,
    growTime: 28559,
    growStages: [7419, 14179, 17438, 28559],
    yield: 3,
    sellPrice: 16,
    xp: 6,
    desc: 'Giống Cam vùng Nam.'
  },
  {
    id: 'qua-2',
    icon: '🍌',
    name: 'Cam Bắc',
    type: 'qua',
    seedPrice: 42,
    growTime: 32912,
    growStages: [17134, 17855, 22682, 32912],
    yield: 4,
    sellPrice: 17,
    xp: 7,
    desc: 'Giống Cam vùng Bắc.'
  },
  {
    id: 'qua-3',
    icon: '🥭',
    name: 'Cam Tây',
    type: 'qua',
    seedPrice: 43,
    growTime: 48324,
    growStages: [39055, 44788, 46504, 48324],
    yield: 5,
    sellPrice: 18,
    xp: 8,
    desc: 'Giống Cam vùng Tây.'
  },
  {
    id: 'qua-4',
    icon: '🍇',
    name: 'Cam Đông',
    type: 'qua',
    seedPrice: 44,
    growTime: 62720,
    growStages: [37549, 40937, 43501, 62720],
    yield: 6,
    sellPrice: 19,
    xp: 9,
    desc: 'Giống Cam vùng Đông.'
  },
  {
    id: 'qua-5',
    icon: '🍉',
    name: 'Cam Cao Nguyên',
    type: 'qua',
    seedPrice: 45,
    growTime: 45495,
    growStages: [32248, 33756, 38388, 45495],
    yield: 7,
    sellPrice: 20,
    xp: 10,
    desc: 'Giống Cam vùng Cao Nguyên.'
  },
  {
    id: 'qua-6',
    icon: '🟢',
    name: 'Cam Đồng Bằng',
    type: 'qua',
    seedPrice: 46,
    growTime: 38007,
    growStages: [25019, 30639, 32820, 38007],
    yield: 2,
    sellPrice: 21,
    xp: 11,
    desc: 'Giống Cam vùng Đồng Bằng.'
  },
  {
    id: 'qua-7',
    icon: '🍐',
    name: 'Cam Núi',
    type: 'qua',
    seedPrice: 47,
    growTime: 43337,
    growStages: [20802, 27006, 35732, 43337],
    yield: 3,
    sellPrice: 22,
    xp: 12,
    desc: 'Giống Cam vùng Núi.'
  },
  {
    id: 'qua-8',
    icon: '🍑',
    name: 'Cam Biển',
    type: 'qua',
    seedPrice: 48,
    growTime: 47803,
    growStages: [26583, 31415, 33534, 47803],
    yield: 4,
    sellPrice: 23,
    xp: 13,
    desc: 'Giống Cam vùng Biển.'
  },
  {
    id: 'qua-9',
    icon: '🟡',
    name: 'Cam Rừng',
    type: 'qua',
    seedPrice: 49,
    growTime: 42259,
    growStages: [16603, 22498, 33675, 42259],
    yield: 5,
    sellPrice: 24,
    xp: 14,
    desc: 'Giống Cam vùng Rừng.'
  },
  {
    id: 'qua-10',
    icon: '🔴',
    name: 'Cam Vườn',
    type: 'qua',
    seedPrice: 50,
    growTime: 60838,
    growStages: [36526, 37387, 47077, 60838],
    yield: 6,
    sellPrice: 25,
    xp: 15,
    desc: 'Giống Cam vùng Vườn.'
  },
  {
    id: 'qua-11',
    icon: '🍒',
    name: 'Táo Nam',
    type: 'qua',
    seedPrice: 51,
    growTime: 27768,
    growStages: [6623, 10552, 15661, 27768],
    yield: 7,
    sellPrice: 26,
    xp: 16,
    desc: 'Giống Táo vùng Nam.'
  },
  {
    id: 'qua-12',
    icon: '🥥',
    name: 'Táo Bắc',
    type: 'qua',
    seedPrice: 52,
    growTime: 36858,
    growStages: [22695, 24523, 25319, 36858],
    yield: 2,
    sellPrice: 27,
    xp: 17,
    desc: 'Giống Táo vùng Bắc.'
  },
  {
    id: 'qua-13',
    icon: '🍈',
    name: 'Táo Tây',
    type: 'qua',
    seedPrice: 53,
    growTime: 36204,
    growStages: [20457, 25963, 35125, 36204],
    yield: 3,
    sellPrice: 28,
    xp: 18,
    desc: 'Giống Táo vùng Tây.'
  },
  {
    id: 'qua-14',
    icon: '🍋',
    name: 'Táo Đông',
    type: 'qua',
    seedPrice: 54,
    growTime: 64539,
    growStages: [38147, 41141, 48228, 64539],
    yield: 4,
    sellPrice: 29,
    xp: 19,
    desc: 'Giống Táo vùng Đông.'
  },
  {
    id: 'qua-15',
    icon: '🍊',
    name: 'Táo Cao Nguyên',
    type: 'qua',
    seedPrice: 55,
    growTime: 33781,
    growStages: [10048, 16708, 29529, 33781],
    yield: 5,
    sellPrice: 30,
    xp: 20,
    desc: 'Giống Táo vùng Cao Nguyên.'
  },
  {
    id: 'qua-16',
    icon: '🍎',
    name: 'Táo Đồng Bằng',
    type: 'qua',
    seedPrice: 56,
    growTime: 46429,
    growStages: [21609, 26845, 32808, 46429],
    yield: 6,
    sellPrice: 31,
    xp: 21,
    desc: 'Giống Táo vùng Đồng Bằng.'
  },
  {
    id: 'qua-17',
    icon: '🍌',
    name: 'Táo Núi',
    type: 'qua',
    seedPrice: 57,
    growTime: 39422,
    growStages: [17933, 23222, 31744, 39422],
    yield: 7,
    sellPrice: 32,
    xp: 22,
    desc: 'Giống Táo vùng Núi.'
  },
  {
    id: 'qua-18',
    icon: '🥭',
    name: 'Táo Biển',
    type: 'qua',
    seedPrice: 58,
    growTime: 27050,
    growStages: [7891, 9719, 18651, 27050],
    yield: 2,
    sellPrice: 33,
    xp: 5,
    desc: 'Giống Táo vùng Biển.'
  },
  {
    id: 'qua-19',
    icon: '🍇',
    name: 'Táo Rừng',
    type: 'qua',
    seedPrice: 59,
    growTime: 45533,
    growStages: [24178, 29152, 41287, 45533],
    yield: 3,
    sellPrice: 34,
    xp: 6,
    desc: 'Giống Táo vùng Rừng.'
  },
  {
    id: 'qua-20',
    icon: '🍉',
    name: 'Táo Vườn',
    type: 'qua',
    seedPrice: 60,
    growTime: 27319,
    growStages: [7099, 11778, 20609, 27319],
    yield: 4,
    sellPrice: 35,
    xp: 7,
    desc: 'Giống Táo vùng Vườn.'
  },
  {
    id: 'qua-21',
    icon: '🟢',
    name: 'Chuối Nam',
    type: 'qua',
    seedPrice: 61,
    growTime: 51344,
    growStages: [38023, 39390, 45384, 51344],
    yield: 5,
    sellPrice: 36,
    xp: 8,
    desc: 'Giống Chuối vùng Nam.'
  },
  {
    id: 'qua-22',
    icon: '🍐',
    name: 'Chuối Bắc',
    type: 'qua',
    seedPrice: 62,
    growTime: 49800,
    growStages: [25975, 31000, 42206, 49800],
    yield: 6,
    sellPrice: 37,
    xp: 9,
    desc: 'Giống Chuối vùng Bắc.'
  },
  {
    id: 'qua-23',
    icon: '🍑',
    name: 'Chuối Tây',
    type: 'qua',
    seedPrice: 63,
    growTime: 45033,
    growStages: [21199, 23050, 31053, 45033],
    yield: 7,
    sellPrice: 38,
    xp: 10,
    desc: 'Giống Chuối vùng Tây.'
  },
  {
    id: 'qua-24',
    icon: '🟡',
    name: 'Chuối Đông',
    type: 'qua',
    seedPrice: 64,
    growTime: 34525,
    growStages: [18141, 20970, 28106, 34525],
    yield: 2,
    sellPrice: 39,
    xp: 11,
    desc: 'Giống Chuối vùng Đông.'
  },
  {
    id: 'qua-25',
    icon: '🔴',
    name: 'Chuối Cao Nguyên',
    type: 'qua',
    seedPrice: 65,
    growTime: 65165,
    growStages: [41579, 44073, 56609, 65165],
    yield: 3,
    sellPrice: 40,
    xp: 12,
    desc: 'Giống Chuối vùng Cao Nguyên.'
  },
  {
    id: 'qua-26',
    icon: '🍒',
    name: 'Chuối Đồng Bằng',
    type: 'qua',
    seedPrice: 66,
    growTime: 48954,
    growStages: [36303, 39143, 44845, 48954],
    yield: 4,
    sellPrice: 41,
    xp: 13,
    desc: 'Giống Chuối vùng Đồng Bằng.'
  },
  {
    id: 'qua-27',
    icon: '🥥',
    name: 'Chuối Núi',
    type: 'qua',
    seedPrice: 67,
    growTime: 43322,
    growStages: [13107, 18182, 22408, 43322],
    yield: 5,
    sellPrice: 42,
    xp: 14,
    desc: 'Giống Chuối vùng Núi.'
  },
  {
    id: 'qua-28',
    icon: '🍈',
    name: 'Chuối Biển',
    type: 'qua',
    seedPrice: 68,
    growTime: 15064,
    growStages: [6669, 7181, 14827, 15064],
    yield: 6,
    sellPrice: 43,
    xp: 15,
    desc: 'Giống Chuối vùng Biển.'
  },
  {
    id: 'qua-29',
    icon: '🍋',
    name: 'Chuối Rừng',
    type: 'qua',
    seedPrice: 69,
    growTime: 41207,
    growStages: [30302, 36165, 40846, 41207],
    yield: 7,
    sellPrice: 44,
    xp: 16,
    desc: 'Giống Chuối vùng Rừng.'
  },
  {
    id: 'qua-30',
    icon: '🍊',
    name: 'Chuối Vườn',
    type: 'qua',
    seedPrice: 70,
    growTime: 18315,
    growStages: [3824, 9157, 16433, 18315],
    yield: 2,
    sellPrice: 45,
    xp: 17,
    desc: 'Giống Chuối vùng Vườn.'
  },
  {
    id: 'qua-31',
    icon: '🍎',
    name: 'Xoài Nam',
    type: 'qua',
    seedPrice: 71,
    growTime: 77900,
    growStages: [41321, 45512, 58111, 77900],
    yield: 3,
    sellPrice: 46,
    xp: 18,
    desc: 'Giống Xoài vùng Nam.'
  },
  {
    id: 'qua-32',
    icon: '🍌',
    name: 'Xoài Bắc',
    type: 'qua',
    seedPrice: 72,
    growTime: 47954,
    growStages: [35477, 35723, 39754, 47954],
    yield: 4,
    sellPrice: 47,
    xp: 19,
    desc: 'Giống Xoài vùng Bắc.'
  },
  {
    id: 'qua-33',
    icon: '🥭',
    name: 'Xoài Tây',
    type: 'qua',
    seedPrice: 73,
    growTime: 12275,
    growStages: [346, 5262, 9491, 12275],
    yield: 5,
    sellPrice: 48,
    xp: 20,
    desc: 'Giống Xoài vùng Tây.'
  },
  {
    id: 'qua-34',
    icon: '🍇',
    name: 'Xoài Đông',
    type: 'qua',
    seedPrice: 74,
    growTime: 54759,
    growStages: [38910, 41422, 42115, 54759],
    yield: 6,
    sellPrice: 49,
    xp: 21,
    desc: 'Giống Xoài vùng Đông.'
  },
  {
    id: 'qua-35',
    icon: '🍉',
    name: 'Xoài Cao Nguyên',
    type: 'qua',
    seedPrice: 75,
    growTime: 35931,
    growStages: [18937, 21175, 31596, 35931],
    yield: 7,
    sellPrice: 50,
    xp: 22,
    desc: 'Giống Xoài vùng Cao Nguyên.'
  },
  {
    id: 'qua-36',
    icon: '🟢',
    name: 'Xoài Đồng Bằng',
    type: 'qua',
    seedPrice: 76,
    growTime: 31484,
    growStages: [11998, 18772, 30923, 31484],
    yield: 2,
    sellPrice: 51,
    xp: 5,
    desc: 'Giống Xoài vùng Đồng Bằng.'
  },
  {
    id: 'qua-37',
    icon: '🍐',
    name: 'Xoài Núi',
    type: 'qua',
    seedPrice: 77,
    growTime: 39401,
    growStages: [6335, 7947, 18171, 39401],
    yield: 3,
    sellPrice: 52,
    xp: 6,
    desc: 'Giống Xoài vùng Núi.'
  },
  {
    id: 'qua-38',
    icon: '🍑',
    name: 'Xoài Biển',
    type: 'qua',
    seedPrice: 78,
    growTime: 39948,
    growStages: [22570, 28910, 30000, 39948],
    yield: 4,
    sellPrice: 53,
    xp: 7,
    desc: 'Giống Xoài vùng Biển.'
  },
  {
    id: 'qua-39',
    icon: '🟡',
    name: 'Xoài Rừng',
    type: 'qua',
    seedPrice: 79,
    growTime: 12624,
    growStages: [2956, 4402, 9745, 12624],
    yield: 5,
    sellPrice: 54,
    xp: 8,
    desc: 'Giống Xoài vùng Rừng.'
  },
  {
    id: 'qua-40',
    icon: '🔴',
    name: 'Xoài Vườn',
    type: 'qua',
    seedPrice: 80,
    growTime: 53050,
    growStages: [33495, 38055, 42722, 53050],
    yield: 6,
    sellPrice: 15,
    xp: 9,
    desc: 'Giống Xoài vùng Vườn.'
  },
  {
    id: 'qua-41',
    icon: '🍒',
    name: 'Nho Nam',
    type: 'qua',
    seedPrice: 81,
    growTime: 28395,
    growStages: [6779, 8616, 8952, 28395],
    yield: 7,
    sellPrice: 16,
    xp: 10,
    desc: 'Giống Nho vùng Nam.'
  },
  {
    id: 'qua-42',
    icon: '🥥',
    name: 'Nho Bắc',
    type: 'qua',
    seedPrice: 82,
    growTime: 36165,
    growStages: [28919, 30794, 33679, 36165],
    yield: 2,
    sellPrice: 17,
    xp: 11,
    desc: 'Giống Nho vùng Bắc.'
  },
  {
    id: 'qua-43',
    icon: '🍈',
    name: 'Nho Tây',
    type: 'qua',
    seedPrice: 83,
    growTime: 37223,
    growStages: [14298, 15429, 29221, 37223],
    yield: 3,
    sellPrice: 18,
    xp: 12,
    desc: 'Giống Nho vùng Tây.'
  },
  {
    id: 'qua-44',
    icon: '🍋',
    name: 'Nho Đông',
    type: 'qua',
    seedPrice: 84,
    growTime: 55188,
    growStages: [22562, 29312, 34751, 55188],
    yield: 4,
    sellPrice: 19,
    xp: 13,
    desc: 'Giống Nho vùng Đông.'
  },
  {
    id: 'qua-45',
    icon: '🍊',
    name: 'Nho Cao Nguyên',
    type: 'qua',
    seedPrice: 85,
    growTime: 45974,
    growStages: [22017, 22230, 30034, 45974],
    yield: 5,
    sellPrice: 20,
    xp: 14,
    desc: 'Giống Nho vùng Cao Nguyên.'
  },
  {
    id: 'qua-46',
    icon: '🍎',
    name: 'Nho Đồng Bằng',
    type: 'qua',
    seedPrice: 86,
    growTime: 38557,
    growStages: [20894, 23635, 32847, 38557],
    yield: 6,
    sellPrice: 21,
    xp: 15,
    desc: 'Giống Nho vùng Đồng Bằng.'
  },
  {
    id: 'qua-47',
    icon: '🍌',
    name: 'Nho Núi',
    type: 'qua',
    seedPrice: 87,
    growTime: 33066,
    growStages: [14370, 20903, 23411, 33066],
    yield: 7,
    sellPrice: 22,
    xp: 16,
    desc: 'Giống Nho vùng Núi.'
  },
  {
    id: 'qua-48',
    icon: '🥭',
    name: 'Nho Biển',
    type: 'qua',
    seedPrice: 88,
    growTime: 44081,
    growStages: [18795, 21313, 24110, 44081],
    yield: 2,
    sellPrice: 23,
    xp: 17,
    desc: 'Giống Nho vùng Biển.'
  },
  {
    id: 'qua-49',
    icon: '🍇',
    name: 'Nho Rừng',
    type: 'qua',
    seedPrice: 89,
    growTime: 39407,
    growStages: [26495, 27631, 29172, 39407],
    yield: 3,
    sellPrice: 24,
    xp: 18,
    desc: 'Giống Nho vùng Rừng.'
  },
  {
    id: 'qua-50',
    icon: '🍉',
    name: 'Nho Vườn',
    type: 'qua',
    seedPrice: 90,
    growTime: 46187,
    growStages: [23140, 29938, 39526, 46187],
    yield: 4,
    sellPrice: 25,
    xp: 19,
    desc: 'Giống Nho vùng Vườn.'
  },
  {
    id: 'qua-51',
    icon: '🟢',
    name: 'Dưa Nam',
    type: 'qua',
    seedPrice: 91,
    growTime: 25511,
    growStages: [12873, 17161, 21005, 25511],
    yield: 5,
    sellPrice: 26,
    xp: 20,
    desc: 'Giống Dưa vùng Nam.'
  },
  {
    id: 'qua-52',
    icon: '🍐',
    name: 'Dưa Bắc',
    type: 'qua',
    seedPrice: 92,
    growTime: 72081,
    growStages: [37338, 42374, 55555, 72081],
    yield: 6,
    sellPrice: 27,
    xp: 21,
    desc: 'Giống Dưa vùng Bắc.'
  },
  {
    id: 'qua-53',
    icon: '🍑',
    name: 'Dưa Tây',
    type: 'qua',
    seedPrice: 93,
    growTime: 60992,
    growStages: [39600, 41762, 53764, 60992],
    yield: 7,
    sellPrice: 28,
    xp: 22,
    desc: 'Giống Dưa vùng Tây.'
  },
  {
    id: 'qua-54',
    icon: '🟡',
    name: 'Dưa Đông',
    type: 'qua',
    seedPrice: 94,
    growTime: 30591,
    growStages: [7888, 12335, 13324, 30591],
    yield: 2,
    sellPrice: 29,
    xp: 5,
    desc: 'Giống Dưa vùng Đông.'
  },
  {
    id: 'qua-55',
    icon: '🔴',
    name: 'Dưa Cao Nguyên',
    type: 'qua',
    seedPrice: 95,
    growTime: 48710,
    growStages: [15414, 17414, 28285, 48710],
    yield: 3,
    sellPrice: 30,
    xp: 6,
    desc: 'Giống Dưa vùng Cao Nguyên.'
  },
  {
    id: 'qua-56',
    icon: '🍒',
    name: 'Dưa Đồng Bằng',
    type: 'qua',
    seedPrice: 96,
    growTime: 12765,
    growStages: [4588, 6157, 7308, 12765],
    yield: 4,
    sellPrice: 31,
    xp: 7,
    desc: 'Giống Dưa vùng Đồng Bằng.'
  },
  {
    id: 'qua-57',
    icon: '🥥',
    name: 'Dưa Núi',
    type: 'qua',
    seedPrice: 97,
    growTime: 66544,
    growStages: [43015, 45400, 53317, 66544],
    yield: 5,
    sellPrice: 32,
    xp: 8,
    desc: 'Giống Dưa vùng Núi.'
  },
  {
    id: 'qua-58',
    icon: '🍈',
    name: 'Dưa Biển',
    type: 'qua',
    seedPrice: 98,
    growTime: 70611,
    growStages: [33637, 39577, 53206, 70611],
    yield: 6,
    sellPrice: 33,
    xp: 9,
    desc: 'Giống Dưa vùng Biển.'
  },
  {
    id: 'qua-59',
    icon: '🍋',
    name: 'Dưa Rừng',
    type: 'qua',
    seedPrice: 99,
    growTime: 39791,
    growStages: [23073, 25052, 35320, 39791],
    yield: 7,
    sellPrice: 34,
    xp: 10,
    desc: 'Giống Dưa vùng Rừng.'
  },
  {
    id: 'qua-60',
    icon: '🍊',
    name: 'Dưa Vườn',
    type: 'qua',
    seedPrice: 100,
    growTime: 39115,
    growStages: [20582, 27370, 36357, 39115],
    yield: 2,
    sellPrice: 35,
    xp: 11,
    desc: 'Giống Dưa vùng Vườn.'
  },
  {
    id: 'qua-61',
    icon: '🍎',
    name: 'Ổi Nam',
    type: 'qua',
    seedPrice: 101,
    growTime: 50908,
    growStages: [30188, 33874, 34343, 50908],
    yield: 3,
    sellPrice: 36,
    xp: 12,
    desc: 'Giống Ổi vùng Nam.'
  },
  {
    id: 'qua-62',
    icon: '🍌',
    name: 'Ổi Bắc',
    type: 'qua',
    seedPrice: 102,
    growTime: 47731,
    growStages: [30308, 31447, 41265, 47731],
    yield: 4,
    sellPrice: 37,
    xp: 13,
    desc: 'Giống Ổi vùng Bắc.'
  },
  {
    id: 'qua-63',
    icon: '🥭',
    name: 'Ổi Tây',
    type: 'qua',
    seedPrice: 103,
    growTime: 26658,
    growStages: [9893, 15518, 16960, 26658],
    yield: 5,
    sellPrice: 38,
    xp: 14,
    desc: 'Giống Ổi vùng Tây.'
  },
  {
    id: 'qua-64',
    icon: '🍇',
    name: 'Ổi Đông',
    type: 'qua',
    seedPrice: 104,
    growTime: 49032,
    growStages: [22188, 29003, 31016, 49032],
    yield: 6,
    sellPrice: 39,
    xp: 15,
    desc: 'Giống Ổi vùng Đông.'
  },
  {
    id: 'qua-65',
    icon: '🍉',
    name: 'Ổi Cao Nguyên',
    type: 'qua',
    seedPrice: 105,
    growTime: 43131,
    growStages: [17247, 24011, 25397, 43131],
    yield: 7,
    sellPrice: 40,
    xp: 16,
    desc: 'Giống Ổi vùng Cao Nguyên.'
  },
  {
    id: 'qua-66',
    icon: '🟢',
    name: 'Ổi Đồng Bằng',
    type: 'qua',
    seedPrice: 106,
    growTime: 48629,
    growStages: [29138, 29524, 38320, 48629],
    yield: 2,
    sellPrice: 41,
    xp: 17,
    desc: 'Giống Ổi vùng Đồng Bằng.'
  },
  {
    id: 'qua-67',
    icon: '🍐',
    name: 'Ổi Núi',
    type: 'qua',
    seedPrice: 107,
    growTime: 67511,
    growStages: [31272, 37572, 50787, 67511],
    yield: 3,
    sellPrice: 42,
    xp: 18,
    desc: 'Giống Ổi vùng Núi.'
  },
  {
    id: 'qua-68',
    icon: '🍑',
    name: 'Ổi Biển',
    type: 'qua',
    seedPrice: 108,
    growTime: 47844,
    growStages: [38264, 40020, 42972, 47844],
    yield: 4,
    sellPrice: 43,
    xp: 19,
    desc: 'Giống Ổi vùng Biển.'
  },
  {
    id: 'qua-69',
    icon: '🟡',
    name: 'Ổi Rừng',
    type: 'qua',
    seedPrice: 109,
    growTime: 22919,
    growStages: [477, 3971, 7977, 22919],
    yield: 5,
    sellPrice: 44,
    xp: 20,
    desc: 'Giống Ổi vùng Rừng.'
  },
  {
    id: 'qua-70',
    icon: '🔴',
    name: 'Ổi Vườn',
    type: 'qua',
    seedPrice: 110,
    growTime: 58255,
    growStages: [37878, 43081, 53124, 58255],
    yield: 6,
    sellPrice: 45,
    xp: 21,
    desc: 'Giống Ổi vùng Vườn.'
  },
  {
    id: 'qua-71',
    icon: '🍒',
    name: 'Lê Nam',
    type: 'qua',
    seedPrice: 111,
    growTime: 46438,
    growStages: [25378, 27062, 41410, 46438],
    yield: 7,
    sellPrice: 46,
    xp: 22,
    desc: 'Giống Lê vùng Nam.'
  },
  {
    id: 'qua-72',
    icon: '🥥',
    name: 'Lê Bắc',
    type: 'qua',
    seedPrice: 112,
    growTime: 51611,
    growStages: [13898, 20062, 32927, 51611],
    yield: 2,
    sellPrice: 47,
    xp: 5,
    desc: 'Giống Lê vùng Bắc.'
  },
  {
    id: 'qua-73',
    icon: '🍈',
    name: 'Lê Tây',
    type: 'qua',
    seedPrice: 113,
    growTime: 27269,
    growStages: [13609, 16064, 24965, 27269],
    yield: 3,
    sellPrice: 48,
    xp: 6,
    desc: 'Giống Lê vùng Tây.'
  },
  {
    id: 'qua-74',
    icon: '🍋',
    name: 'Lê Đông',
    type: 'qua',
    seedPrice: 114,
    growTime: 35538,
    growStages: [15842, 16112, 21882, 35538],
    yield: 4,
    sellPrice: 49,
    xp: 7,
    desc: 'Giống Lê vùng Đông.'
  },
  {
    id: 'qua-75',
    icon: '🍊',
    name: 'Lê Cao Nguyên',
    type: 'qua',
    seedPrice: 115,
    growTime: 49293,
    growStages: [25282, 26785, 31080, 49293],
    yield: 5,
    sellPrice: 50,
    xp: 8,
    desc: 'Giống Lê vùng Cao Nguyên.'
  },
  {
    id: 'qua-76',
    icon: '🍎',
    name: 'Lê Đồng Bằng',
    type: 'qua',
    seedPrice: 116,
    growTime: 47294,
    growStages: [29279, 34123, 46570, 47294],
    yield: 6,
    sellPrice: 51,
    xp: 9,
    desc: 'Giống Lê vùng Đồng Bằng.'
  },
  {
    id: 'qua-77',
    icon: '🍌',
    name: 'Lê Núi',
    type: 'qua',
    seedPrice: 117,
    growTime: 35247,
    growStages: [9419, 14224, 25569, 35247],
    yield: 7,
    sellPrice: 52,
    xp: 10,
    desc: 'Giống Lê vùng Núi.'
  },
  {
    id: 'qua-78',
    icon: '🥭',
    name: 'Lê Biển',
    type: 'qua',
    seedPrice: 118,
    growTime: 43965,
    growStages: [21841, 24889, 25216, 43965],
    yield: 2,
    sellPrice: 53,
    xp: 11,
    desc: 'Giống Lê vùng Biển.'
  },
  {
    id: 'qua-79',
    icon: '🍇',
    name: 'Lê Rừng',
    type: 'qua',
    seedPrice: 119,
    growTime: 51407,
    growStages: [26628, 33059, 44526, 51407],
    yield: 3,
    sellPrice: 54,
    xp: 12,
    desc: 'Giống Lê vùng Rừng.'
  },
  {
    id: 'qua-80',
    icon: '🍉',
    name: 'Lê Vườn',
    type: 'qua',
    seedPrice: 120,
    growTime: 44271,
    growStages: [18706, 23419, 28668, 44271],
    yield: 4,
    sellPrice: 15,
    xp: 13,
    desc: 'Giống Lê vùng Vườn.'
  },
  {
    id: 'qua-81',
    icon: '🟢',
    name: 'Đào Nam',
    type: 'qua',
    seedPrice: 121,
    growTime: 47667,
    growStages: [37414, 41500, 46314, 47667],
    yield: 5,
    sellPrice: 16,
    xp: 14,
    desc: 'Giống Đào vùng Nam.'
  },
  {
    id: 'qua-82',
    icon: '🍐',
    name: 'Đào Bắc',
    type: 'qua',
    seedPrice: 122,
    growTime: 69127,
    growStages: [33460, 37012, 48767, 69127],
    yield: 6,
    sellPrice: 17,
    xp: 15,
    desc: 'Giống Đào vùng Bắc.'
  },
  {
    id: 'qua-83',
    icon: '🍑',
    name: 'Đào Tây',
    type: 'qua',
    seedPrice: 123,
    growTime: 55667,
    growStages: [39244, 46322, 51030, 55667],
    yield: 7,
    sellPrice: 18,
    xp: 16,
    desc: 'Giống Đào vùng Tây.'
  },
  {
    id: 'qua-84',
    icon: '🟡',
    name: 'Đào Đông',
    type: 'qua',
    seedPrice: 124,
    growTime: 52113,
    growStages: [38090, 39695, 43474, 52113],
    yield: 2,
    sellPrice: 19,
    xp: 17,
    desc: 'Giống Đào vùng Đông.'
  },
  {
    id: 'qua-85',
    icon: '🔴',
    name: 'Đào Cao Nguyên',
    type: 'qua',
    seedPrice: 125,
    growTime: 49010,
    growStages: [27013, 33159, 41199, 49010],
    yield: 3,
    sellPrice: 20,
    xp: 18,
    desc: 'Giống Đào vùng Cao Nguyên.'
  },
  {
    id: 'qua-86',
    icon: '🍒',
    name: 'Đào Đồng Bằng',
    type: 'qua',
    seedPrice: 126,
    growTime: 26371,
    growStages: [2843, 9771, 13019, 26371],
    yield: 4,
    sellPrice: 21,
    xp: 19,
    desc: 'Giống Đào vùng Đồng Bằng.'
  },
  {
    id: 'qua-87',
    icon: '🥥',
    name: 'Đào Núi',
    type: 'qua',
    seedPrice: 127,
    growTime: 37110,
    growStages: [3938, 7195, 20121, 37110],
    yield: 5,
    sellPrice: 22,
    xp: 20,
    desc: 'Giống Đào vùng Núi.'
  },
  {
    id: 'qua-88',
    icon: '🍈',
    name: 'Đào Biển',
    type: 'qua',
    seedPrice: 128,
    growTime: 51253,
    growStages: [32060, 36835, 43440, 51253],
    yield: 6,
    sellPrice: 23,
    xp: 21,
    desc: 'Giống Đào vùng Biển.'
  },
  {
    id: 'qua-89',
    icon: '🍋',
    name: 'Đào Rừng',
    type: 'qua',
    seedPrice: 129,
    growTime: 53483,
    growStages: [30838, 36363, 49330, 53483],
    yield: 7,
    sellPrice: 24,
    xp: 22,
    desc: 'Giống Đào vùng Rừng.'
  },
  {
    id: 'qua-90',
    icon: '🍊',
    name: 'Đào Vườn',
    type: 'qua',
    seedPrice: 130,
    growTime: 35864,
    growStages: [12171, 13545, 16929, 35864],
    yield: 2,
    sellPrice: 25,
    xp: 5,
    desc: 'Giống Đào vùng Vườn.'
  },
  {
    id: 'qua-91',
    icon: '🍎',
    name: 'Mít Nam',
    type: 'qua',
    seedPrice: 131,
    growTime: 45593,
    growStages: [18891, 25535, 39110, 45593],
    yield: 3,
    sellPrice: 26,
    xp: 6,
    desc: 'Giống Mít vùng Nam.'
  },
  {
    id: 'qua-92',
    icon: '🍌',
    name: 'Mít Bắc',
    type: 'qua',
    seedPrice: 132,
    growTime: 56986,
    growStages: [20995, 27913, 40628, 56986],
    yield: 4,
    sellPrice: 27,
    xp: 7,
    desc: 'Giống Mít vùng Bắc.'
  },
  {
    id: 'qua-93',
    icon: '🥭',
    name: 'Mít Tây',
    type: 'qua',
    seedPrice: 133,
    growTime: 49527,
    growStages: [31998, 33500, 45476, 49527],
    yield: 5,
    sellPrice: 28,
    xp: 8,
    desc: 'Giống Mít vùng Tây.'
  },
  {
    id: 'qua-94',
    icon: '🍇',
    name: 'Mít Đông',
    type: 'qua',
    seedPrice: 134,
    growTime: 52007,
    growStages: [29266, 31070, 36013, 52007],
    yield: 6,
    sellPrice: 29,
    xp: 9,
    desc: 'Giống Mít vùng Đông.'
  },
  {
    id: 'qua-95',
    icon: '🍉',
    name: 'Mít Cao Nguyên',
    type: 'qua',
    seedPrice: 135,
    growTime: 28617,
    growStages: [3071, 5974, 13624, 28617],
    yield: 7,
    sellPrice: 30,
    xp: 10,
    desc: 'Giống Mít vùng Cao Nguyên.'
  },
  {
    id: 'qua-96',
    icon: '🟢',
    name: 'Mít Đồng Bằng',
    type: 'qua',
    seedPrice: 136,
    growTime: 36741,
    growStages: [16581, 22730, 35233, 36741],
    yield: 2,
    sellPrice: 31,
    xp: 11,
    desc: 'Giống Mít vùng Đồng Bằng.'
  },
  {
    id: 'qua-97',
    icon: '🍐',
    name: 'Mít Núi',
    type: 'qua',
    seedPrice: 137,
    growTime: 46977,
    growStages: [33072, 37445, 39576, 46977],
    yield: 3,
    sellPrice: 32,
    xp: 12,
    desc: 'Giống Mít vùng Núi.'
  },
  {
    id: 'qua-98',
    icon: '🍑',
    name: 'Mít Biển',
    type: 'qua',
    seedPrice: 138,
    growTime: 35027,
    growStages: [14822, 15242, 23595, 35027],
    yield: 4,
    sellPrice: 33,
    xp: 13,
    desc: 'Giống Mít vùng Biển.'
  },
  {
    id: 'qua-99',
    icon: '🟡',
    name: 'Mít Rừng',
    type: 'qua',
    seedPrice: 139,
    growTime: 34406,
    growStages: [24991, 25902, 27881, 34406],
    yield: 5,
    sellPrice: 34,
    xp: 14,
    desc: 'Giống Mít vùng Rừng.'
  },
  {
    id: 'qua-100',
    icon: '🔴',
    name: 'Mít Vườn',
    type: 'qua',
    seedPrice: 40,
    growTime: 55481,
    growStages: [34065, 35188, 44446, 55481],
    yield: 6,
    sellPrice: 35,
    xp: 15,
    desc: 'Giống Mít vùng Vườn.'
  },
  {
    id: 'qua-101',
    icon: '🍒',
    name: 'Nhãn Nam',
    type: 'qua',
    seedPrice: 41,
    growTime: 26135,
    growStages: [19226, 20732, 23372, 26135],
    yield: 7,
    sellPrice: 36,
    xp: 16,
    desc: 'Giống Nhãn vùng Nam.'
  },
  {
    id: 'qua-102',
    icon: '🥥',
    name: 'Nhãn Bắc',
    type: 'qua',
    seedPrice: 42,
    growTime: 60304,
    growStages: [25456, 32302, 43257, 60304],
    yield: 2,
    sellPrice: 37,
    xp: 17,
    desc: 'Giống Nhãn vùng Bắc.'
  },
  {
    id: 'qua-103',
    icon: '🍈',
    name: 'Nhãn Tây',
    type: 'qua',
    seedPrice: 43,
    growTime: 18767,
    growStages: [1244, 4535, 17296, 18767],
    yield: 3,
    sellPrice: 38,
    xp: 18,
    desc: 'Giống Nhãn vùng Tây.'
  },
  {
    id: 'qua-104',
    icon: '🍋',
    name: 'Nhãn Đông',
    type: 'qua',
    seedPrice: 44,
    growTime: 35193,
    growStages: [11364, 15239, 19313, 35193],
    yield: 4,
    sellPrice: 39,
    xp: 19,
    desc: 'Giống Nhãn vùng Đông.'
  },
  {
    id: 'qua-105',
    icon: '🍊',
    name: 'Nhãn Cao Nguyên',
    type: 'qua',
    seedPrice: 45,
    growTime: 43029,
    growStages: [19506, 24056, 37642, 43029],
    yield: 5,
    sellPrice: 40,
    xp: 20,
    desc: 'Giống Nhãn vùng Cao Nguyên.'
  },
  {
    id: 'qua-106',
    icon: '🍎',
    name: 'Nhãn Đồng Bằng',
    type: 'qua',
    seedPrice: 46,
    growTime: 20803,
    growStages: [12620, 17242, 18944, 20803],
    yield: 6,
    sellPrice: 41,
    xp: 21,
    desc: 'Giống Nhãn vùng Đồng Bằng.'
  },
  {
    id: 'qua-107',
    icon: '🍌',
    name: 'Nhãn Núi',
    type: 'qua',
    seedPrice: 47,
    growTime: 44609,
    growStages: [16887, 20715, 30859, 44609],
    yield: 7,
    sellPrice: 42,
    xp: 22,
    desc: 'Giống Nhãn vùng Núi.'
  },
  {
    id: 'qua-108',
    icon: '🥭',
    name: 'Nhãn Biển',
    type: 'qua',
    seedPrice: 48,
    growTime: 49217,
    growStages: [24402, 28853, 42138, 49217],
    yield: 2,
    sellPrice: 43,
    xp: 5,
    desc: 'Giống Nhãn vùng Biển.'
  },
  {
    id: 'qua-109',
    icon: '🍇',
    name: 'Nhãn Rừng',
    type: 'qua',
    seedPrice: 49,
    growTime: 48518,
    growStages: [29880, 31770, 33242, 48518],
    yield: 3,
    sellPrice: 44,
    xp: 6,
    desc: 'Giống Nhãn vùng Rừng.'
  },
  {
    id: 'qua-110',
    icon: '🍉',
    name: 'Nhãn Vườn',
    type: 'qua',
    seedPrice: 50,
    growTime: 34080,
    growStages: [1791, 7733, 17272, 34080],
    yield: 4,
    sellPrice: 45,
    xp: 7,
    desc: 'Giống Nhãn vùng Vườn.'
  },
  {
    id: 'qua-111',
    icon: '🟢',
    name: 'Vải Nam',
    type: 'qua',
    seedPrice: 51,
    growTime: 42343,
    growStages: [23271, 26913, 29797, 42343],
    yield: 5,
    sellPrice: 46,
    xp: 8,
    desc: 'Giống Vải vùng Nam.'
  },
  {
    id: 'qua-112',
    icon: '🍐',
    name: 'Vải Bắc',
    type: 'qua',
    seedPrice: 52,
    growTime: 24070,
    growStages: [4780, 7930, 19738, 24070],
    yield: 6,
    sellPrice: 47,
    xp: 9,
    desc: 'Giống Vải vùng Bắc.'
  },
  {
    id: 'qua-113',
    icon: '🍑',
    name: 'Vải Tây',
    type: 'qua',
    seedPrice: 53,
    growTime: 44849,
    growStages: [14165, 17420, 28949, 44849],
    yield: 7,
    sellPrice: 48,
    xp: 10,
    desc: 'Giống Vải vùng Tây.'
  },
  {
    id: 'qua-114',
    icon: '🟡',
    name: 'Vải Đông',
    type: 'qua',
    seedPrice: 54,
    growTime: 19254,
    growStages: [6774, 13492, 13902, 19254],
    yield: 2,
    sellPrice: 49,
    xp: 11,
    desc: 'Giống Vải vùng Đông.'
  },
  {
    id: 'qua-115',
    icon: '🔴',
    name: 'Vải Cao Nguyên',
    type: 'qua',
    seedPrice: 55,
    growTime: 29098,
    growStages: [18311, 20523, 22704, 29098],
    yield: 3,
    sellPrice: 50,
    xp: 12,
    desc: 'Giống Vải vùng Cao Nguyên.'
  },
  {
    id: 'qua-116',
    icon: '🍒',
    name: 'Vải Đồng Bằng',
    type: 'qua',
    seedPrice: 56,
    growTime: 31347,
    growStages: [1772, 4895, 16083, 31347],
    yield: 4,
    sellPrice: 51,
    xp: 13,
    desc: 'Giống Vải vùng Đồng Bằng.'
  },
  {
    id: 'qua-117',
    icon: '🥥',
    name: 'Vải Núi',
    type: 'qua',
    seedPrice: 57,
    growTime: 56386,
    growStages: [29544, 33765, 46886, 56386],
    yield: 5,
    sellPrice: 52,
    xp: 14,
    desc: 'Giống Vải vùng Núi.'
  },
  {
    id: 'qua-118',
    icon: '🍈',
    name: 'Vải Biển',
    type: 'qua',
    seedPrice: 58,
    growTime: 45356,
    growStages: [16864, 20397, 29809, 45356],
    yield: 6,
    sellPrice: 53,
    xp: 15,
    desc: 'Giống Vải vùng Biển.'
  },
  {
    id: 'qua-119',
    icon: '🍋',
    name: 'Vải Rừng',
    type: 'qua',
    seedPrice: 59,
    growTime: 31607,
    growStages: [3170, 8085, 16953, 31607],
    yield: 7,
    sellPrice: 54,
    xp: 16,
    desc: 'Giống Vải vùng Rừng.'
  },
  {
    id: 'qua-120',
    icon: '🍊',
    name: 'Vải Vườn',
    type: 'qua',
    seedPrice: 60,
    growTime: 32039,
    growStages: [8285, 9897, 17318, 32039],
    yield: 2,
    sellPrice: 15,
    xp: 17,
    desc: 'Giống Vải vùng Vườn.'
  },
  {
    id: 'qua-121',
    icon: '🍎',
    name: 'Chôm Chôm Nam',
    type: 'qua',
    seedPrice: 61,
    growTime: 37016,
    growStages: [20804, 23034, 35555, 37016],
    yield: 3,
    sellPrice: 16,
    xp: 18,
    desc: 'Giống Chôm Chôm vùng Nam.'
  },
  {
    id: 'qua-122',
    icon: '🍌',
    name: 'Chôm Chôm Bắc',
    type: 'qua',
    seedPrice: 62,
    growTime: 72478,
    growStages: [40950, 47297, 61615, 72478],
    yield: 4,
    sellPrice: 17,
    xp: 19,
    desc: 'Giống Chôm Chôm vùng Bắc.'
  },
  {
    id: 'qua-123',
    icon: '🥭',
    name: 'Chôm Chôm Tây',
    type: 'qua',
    seedPrice: 63,
    growTime: 35598,
    growStages: [2033, 7170, 15677, 35598],
    yield: 5,
    sellPrice: 18,
    xp: 20,
    desc: 'Giống Chôm Chôm vùng Tây.'
  },
  {
    id: 'qua-124',
    icon: '🍇',
    name: 'Chôm Chôm Đông',
    type: 'qua',
    seedPrice: 64,
    growTime: 46832,
    growStages: [21933, 27278, 31112, 46832],
    yield: 6,
    sellPrice: 19,
    xp: 21,
    desc: 'Giống Chôm Chôm vùng Đông.'
  },
  {
    id: 'qua-125',
    icon: '🍉',
    name: 'Chôm Chôm Cao Nguyên',
    type: 'qua',
    seedPrice: 65,
    growTime: 60167,
    growStages: [26633, 26894, 39223, 60167],
    yield: 7,
    sellPrice: 20,
    xp: 22,
    desc: 'Giống Chôm Chôm vùng Cao Nguyên.'
  },
  {
    id: 'qua-126',
    icon: '🟢',
    name: 'Chôm Chôm Đồng Bằng',
    type: 'qua',
    seedPrice: 66,
    growTime: 47946,
    growStages: [23851, 30870, 40034, 47946],
    yield: 2,
    sellPrice: 21,
    xp: 5,
    desc: 'Giống Chôm Chôm vùng Đồng Bằng.'
  },
  {
    id: 'qua-127',
    icon: '🍐',
    name: 'Chôm Chôm Núi',
    type: 'qua',
    seedPrice: 67,
    growTime: 61323,
    growStages: [36451, 40478, 47829, 61323],
    yield: 3,
    sellPrice: 22,
    xp: 6,
    desc: 'Giống Chôm Chôm vùng Núi.'
  },
  {
    id: 'qua-128',
    icon: '🍑',
    name: 'Chôm Chôm Biển',
    type: 'qua',
    seedPrice: 68,
    growTime: 56952,
    growStages: [40036, 41139, 43203, 56952],
    yield: 4,
    sellPrice: 23,
    xp: 7,
    desc: 'Giống Chôm Chôm vùng Biển.'
  },
  {
    id: 'qua-129',
    icon: '🟡',
    name: 'Chôm Chôm Rừng',
    type: 'qua',
    seedPrice: 69,
    growTime: 41413,
    growStages: [24712, 27873, 34433, 41413],
    yield: 5,
    sellPrice: 24,
    xp: 8,
    desc: 'Giống Chôm Chôm vùng Rừng.'
  },
  {
    id: 'qua-130',
    icon: '🔴',
    name: 'Chôm Chôm Vườn',
    type: 'qua',
    seedPrice: 70,
    growTime: 48345,
    growStages: [33039, 34449, 44303, 48345],
    yield: 6,
    sellPrice: 25,
    xp: 9,
    desc: 'Giống Chôm Chôm vùng Vườn.'
  },
  {
    id: 'qua-131',
    icon: '🍒',
    name: 'Măng Cụt Nam',
    type: 'qua',
    seedPrice: 71,
    growTime: 15159,
    growStages: [1931, 8108, 10139, 15159],
    yield: 7,
    sellPrice: 26,
    xp: 10,
    desc: 'Giống Măng Cụt vùng Nam.'
  },
  {
    id: 'qua-132',
    icon: '🥥',
    name: 'Măng Cụt Bắc',
    type: 'qua',
    seedPrice: 72,
    growTime: 24212,
    growStages: [9519, 15597, 17219, 24212],
    yield: 2,
    sellPrice: 27,
    xp: 11,
    desc: 'Giống Măng Cụt vùng Bắc.'
  },
  {
    id: 'qua-133',
    icon: '🍈',
    name: 'Măng Cụt Tây',
    type: 'qua',
    seedPrice: 73,
    growTime: 63433,
    growStages: [33022, 38887, 50650, 63433],
    yield: 3,
    sellPrice: 28,
    xp: 12,
    desc: 'Giống Măng Cụt vùng Tây.'
  },
  {
    id: 'qua-134',
    icon: '🍋',
    name: 'Măng Cụt Đông',
    type: 'qua',
    seedPrice: 74,
    growTime: 42219,
    growStages: [12280, 15069, 24110, 42219],
    yield: 4,
    sellPrice: 29,
    xp: 13,
    desc: 'Giống Măng Cụt vùng Đông.'
  },
  {
    id: 'qua-135',
    icon: '🍊',
    name: 'Măng Cụt Cao Nguyên',
    type: 'qua',
    seedPrice: 75,
    growTime: 65273,
    growStages: [28963, 36076, 48968, 65273],
    yield: 5,
    sellPrice: 30,
    xp: 14,
    desc: 'Giống Măng Cụt vùng Cao Nguyên.'
  },
  {
    id: 'qua-136',
    icon: '🍎',
    name: 'Măng Cụt Đồng Bằng',
    type: 'qua',
    seedPrice: 76,
    growTime: 58660,
    growStages: [34926, 39245, 44840, 58660],
    yield: 6,
    sellPrice: 31,
    xp: 15,
    desc: 'Giống Măng Cụt vùng Đồng Bằng.'
  },
  {
    id: 'qua-137',
    icon: '🍌',
    name: 'Măng Cụt Núi',
    type: 'qua',
    seedPrice: 77,
    growTime: 40232,
    growStages: [18166, 25362, 38980, 40232],
    yield: 7,
    sellPrice: 32,
    xp: 16,
    desc: 'Giống Măng Cụt vùng Núi.'
  },
  {
    id: 'qua-138',
    icon: '🥭',
    name: 'Măng Cụt Biển',
    type: 'qua',
    seedPrice: 78,
    growTime: 61217,
    growStages: [30643, 33610, 44908, 61217],
    yield: 2,
    sellPrice: 33,
    xp: 17,
    desc: 'Giống Măng Cụt vùng Biển.'
  },
  {
    id: 'qua-139',
    icon: '🍇',
    name: 'Măng Cụt Rừng',
    type: 'qua',
    seedPrice: 79,
    growTime: 25363,
    growStages: [7653, 9839, 13255, 25363],
    yield: 3,
    sellPrice: 34,
    xp: 18,
    desc: 'Giống Măng Cụt vùng Rừng.'
  },
  {
    id: 'qua-140',
    icon: '🍉',
    name: 'Măng Cụt Vườn',
    type: 'qua',
    seedPrice: 80,
    growTime: 38248,
    growStages: [3545, 8630, 19054, 38248],
    yield: 4,
    sellPrice: 35,
    xp: 19,
    desc: 'Giống Măng Cụt vùng Vườn.'
  },
  {
    id: 'qua-141',
    icon: '🟢',
    name: 'Đu Đủ Nam',
    type: 'qua',
    seedPrice: 81,
    growTime: 45640,
    growStages: [16989, 23746, 32090, 45640],
    yield: 5,
    sellPrice: 36,
    xp: 20,
    desc: 'Giống Đu Đủ vùng Nam.'
  },
  {
    id: 'qua-142',
    icon: '🍐',
    name: 'Đu Đủ Bắc',
    type: 'qua',
    seedPrice: 82,
    growTime: 49461,
    growStages: [36290, 39404, 41577, 49461],
    yield: 6,
    sellPrice: 37,
    xp: 21,
    desc: 'Giống Đu Đủ vùng Bắc.'
  },
  {
    id: 'qua-143',
    icon: '🍑',
    name: 'Đu Đủ Tây',
    type: 'qua',
    seedPrice: 83,
    growTime: 29860,
    growStages: [12047, 18564, 20642, 29860],
    yield: 7,
    sellPrice: 38,
    xp: 22,
    desc: 'Giống Đu Đủ vùng Tây.'
  },
  {
    id: 'qua-144',
    icon: '🟡',
    name: 'Đu Đủ Đông',
    type: 'qua',
    seedPrice: 84,
    growTime: 23078,
    growStages: [629, 2577, 6497, 23078],
    yield: 2,
    sellPrice: 39,
    xp: 5,
    desc: 'Giống Đu Đủ vùng Đông.'
  },
  {
    id: 'qua-145',
    icon: '🔴',
    name: 'Đu Đủ Cao Nguyên',
    type: 'qua',
    seedPrice: 85,
    growTime: 62375,
    growStages: [40832, 46568, 53733, 62375],
    yield: 3,
    sellPrice: 40,
    xp: 6,
    desc: 'Giống Đu Đủ vùng Cao Nguyên.'
  },
  {
    id: 'qua-146',
    icon: '🍒',
    name: 'Đu Đủ Đồng Bằng',
    type: 'qua',
    seedPrice: 86,
    growTime: 36856,
    growStages: [8587, 10205, 16189, 36856],
    yield: 4,
    sellPrice: 41,
    xp: 7,
    desc: 'Giống Đu Đủ vùng Đồng Bằng.'
  },
  {
    id: 'qua-147',
    icon: '🥥',
    name: 'Đu Đủ Núi',
    type: 'qua',
    seedPrice: 87,
    growTime: 49607,
    growStages: [20627, 27358, 30154, 49607],
    yield: 5,
    sellPrice: 42,
    xp: 8,
    desc: 'Giống Đu Đủ vùng Núi.'
  },
  {
    id: 'qua-148',
    icon: '🍈',
    name: 'Đu Đủ Biển',
    type: 'qua',
    seedPrice: 88,
    growTime: 47494,
    growStages: [32921, 37597, 38616, 47494],
    yield: 6,
    sellPrice: 43,
    xp: 9,
    desc: 'Giống Đu Đủ vùng Biển.'
  },
  {
    id: 'qua-149',
    icon: '🍋',
    name: 'Đu Đủ Rừng',
    type: 'qua',
    seedPrice: 89,
    growTime: 29909,
    growStages: [1566, 5441, 8796, 29909],
    yield: 7,
    sellPrice: 44,
    xp: 10,
    desc: 'Giống Đu Đủ vùng Rừng.'
  },
  {
    id: 'qua-150',
    icon: '🍊',
    name: 'Đu Đủ Vườn',
    type: 'qua',
    seedPrice: 90,
    growTime: 51749,
    growStages: [16285, 22763, 37114, 51749],
    yield: 2,
    sellPrice: 45,
    xp: 11,
    desc: 'Giống Đu Đủ vùng Vườn.'
  },
  {
    id: 'qua-151',
    icon: '🍎',
    name: 'Khế Nam',
    type: 'qua',
    seedPrice: 91,
    growTime: 60702,
    growStages: [32353, 35657, 43594, 60702],
    yield: 3,
    sellPrice: 46,
    xp: 12,
    desc: 'Giống Khế vùng Nam.'
  },
  {
    id: 'qua-152',
    icon: '🍌',
    name: 'Khế Bắc',
    type: 'qua',
    seedPrice: 92,
    growTime: 40289,
    growStages: [29385, 29521, 32848, 40289],
    yield: 4,
    sellPrice: 47,
    xp: 13,
    desc: 'Giống Khế vùng Bắc.'
  },
  {
    id: 'qua-153',
    icon: '🥭',
    name: 'Khế Tây',
    type: 'qua',
    seedPrice: 93,
    growTime: 31314,
    growStages: [19133, 22517, 23903, 31314],
    yield: 5,
    sellPrice: 48,
    xp: 14,
    desc: 'Giống Khế vùng Tây.'
  },
  {
    id: 'qua-154',
    icon: '🍇',
    name: 'Khế Đông',
    type: 'qua',
    seedPrice: 94,
    growTime: 29205,
    growStages: [8923, 10406, 14053, 29205],
    yield: 6,
    sellPrice: 49,
    xp: 15,
    desc: 'Giống Khế vùng Đông.'
  },
  {
    id: 'qua-155',
    icon: '🍉',
    name: 'Khế Cao Nguyên',
    type: 'qua',
    seedPrice: 95,
    growTime: 53543,
    growStages: [43149, 47502, 52641, 53543],
    yield: 7,
    sellPrice: 50,
    xp: 16,
    desc: 'Giống Khế vùng Cao Nguyên.'
  },
  {
    id: 'qua-156',
    icon: '🟢',
    name: 'Khế Đồng Bằng',
    type: 'qua',
    seedPrice: 96,
    growTime: 20906,
    growStages: [1902, 6223, 14486, 20906],
    yield: 2,
    sellPrice: 51,
    xp: 17,
    desc: 'Giống Khế vùng Đồng Bằng.'
  },
  {
    id: 'qua-157',
    icon: '🍐',
    name: 'Khế Núi',
    type: 'qua',
    seedPrice: 97,
    growTime: 37001,
    growStages: [19605, 20162, 24058, 37001],
    yield: 3,
    sellPrice: 52,
    xp: 18,
    desc: 'Giống Khế vùng Núi.'
  },
  {
    id: 'qua-158',
    icon: '🍑',
    name: 'Khế Biển',
    type: 'qua',
    seedPrice: 98,
    growTime: 62745,
    growStages: [36995, 37802, 48820, 62745],
    yield: 4,
    sellPrice: 53,
    xp: 19,
    desc: 'Giống Khế vùng Biển.'
  },
  {
    id: 'qua-159',
    icon: '🟡',
    name: 'Khế Rừng',
    type: 'qua',
    seedPrice: 99,
    growTime: 30453,
    growStages: [1705, 5892, 14327, 30453],
    yield: 5,
    sellPrice: 54,
    xp: 20,
    desc: 'Giống Khế vùng Rừng.'
  },
  {
    id: 'qua-160',
    icon: '🔴',
    name: 'Khế Vườn',
    type: 'qua',
    seedPrice: 100,
    growTime: 53093,
    growStages: [19153, 24288, 32442, 53093],
    yield: 6,
    sellPrice: 15,
    xp: 21,
    desc: 'Giống Khế vùng Vườn.'
  },
  {
    id: 'qua-161',
    icon: '🍒',
    name: 'Cherry Nam',
    type: 'qua',
    seedPrice: 101,
    growTime: 31105,
    growStages: [26728, 28049, 30114, 31105],
    yield: 7,
    sellPrice: 16,
    xp: 22,
    desc: 'Giống Cherry vùng Nam.'
  },
  {
    id: 'qua-162',
    icon: '🥥',
    name: 'Cherry Bắc',
    type: 'qua',
    seedPrice: 102,
    growTime: 61015,
    growStages: [36817, 42665, 48058, 61015],
    yield: 2,
    sellPrice: 17,
    xp: 5,
    desc: 'Giống Cherry vùng Bắc.'
  },
  {
    id: 'qua-163',
    icon: '🍈',
    name: 'Cherry Tây',
    type: 'qua',
    seedPrice: 103,
    growTime: 39951,
    growStages: [20789, 22940, 36405, 39951],
    yield: 3,
    sellPrice: 18,
    xp: 6,
    desc: 'Giống Cherry vùng Tây.'
  },
  {
    id: 'qua-164',
    icon: '🍋',
    name: 'Cherry Đông',
    type: 'qua',
    seedPrice: 104,
    growTime: 54169,
    growStages: [40134, 45627, 50420, 54169],
    yield: 4,
    sellPrice: 19,
    xp: 7,
    desc: 'Giống Cherry vùng Đông.'
  },
  {
    id: 'qua-165',
    icon: '🍊',
    name: 'Cherry Cao Nguyên',
    type: 'qua',
    seedPrice: 105,
    growTime: 15090,
    growStages: [6231, 11058, 11525, 15090],
    yield: 5,
    sellPrice: 20,
    xp: 8,
    desc: 'Giống Cherry vùng Cao Nguyên.'
  },
  {
    id: 'qua-166',
    icon: '🍎',
    name: 'Cherry Đồng Bằng',
    type: 'qua',
    seedPrice: 106,
    growTime: 41955,
    growStages: [18903, 20752, 30226, 41955],
    yield: 6,
    sellPrice: 21,
    xp: 9,
    desc: 'Giống Cherry vùng Đồng Bằng.'
  },
  {
    id: 'qua-167',
    icon: '🍌',
    name: 'Cherry Núi',
    type: 'qua',
    seedPrice: 107,
    growTime: 41925,
    growStages: [28507, 34812, 41082, 41925],
    yield: 7,
    sellPrice: 22,
    xp: 10,
    desc: 'Giống Cherry vùng Núi.'
  },
  {
    id: 'qua-168',
    icon: '🥭',
    name: 'Cherry Biển',
    type: 'qua',
    seedPrice: 108,
    growTime: 62984,
    growStages: [38185, 39724, 42732, 62984],
    yield: 2,
    sellPrice: 23,
    xp: 11,
    desc: 'Giống Cherry vùng Biển.'
  },
  {
    id: 'qua-169',
    icon: '🍇',
    name: 'Cherry Rừng',
    type: 'qua',
    seedPrice: 109,
    growTime: 46679,
    growStages: [21656, 28338, 35625, 46679],
    yield: 3,
    sellPrice: 24,
    xp: 12,
    desc: 'Giống Cherry vùng Rừng.'
  },
  {
    id: 'qua-170',
    icon: '🍉',
    name: 'Cherry Vườn',
    type: 'qua',
    seedPrice: 110,
    growTime: 41456,
    growStages: [12314, 16294, 26354, 41456],
    yield: 4,
    sellPrice: 25,
    xp: 13,
    desc: 'Giống Cherry vùng Vườn.'
  },
  {
    id: 'qua-171',
    icon: '🟢',
    name: 'Dừa Nam',
    type: 'qua',
    seedPrice: 111,
    growTime: 17629,
    growStages: [7333, 7894, 13392, 17629],
    yield: 5,
    sellPrice: 26,
    xp: 14,
    desc: 'Giống Dừa vùng Nam.'
  },
  {
    id: 'qua-172',
    icon: '🍐',
    name: 'Dừa Bắc',
    type: 'qua',
    seedPrice: 112,
    growTime: 41772,
    growStages: [15146, 20906, 21853, 41772],
    yield: 6,
    sellPrice: 27,
    xp: 15,
    desc: 'Giống Dừa vùng Bắc.'
  },
  {
    id: 'qua-173',
    icon: '🍑',
    name: 'Dừa Tây',
    type: 'qua',
    seedPrice: 113,
    growTime: 11878,
    growStages: [3947, 4139, 5231, 11878],
    yield: 7,
    sellPrice: 28,
    xp: 16,
    desc: 'Giống Dừa vùng Tây.'
  },
  {
    id: 'qua-174',
    icon: '🟡',
    name: 'Dừa Đông',
    type: 'qua',
    seedPrice: 114,
    growTime: 71460,
    growStages: [38824, 41973, 55633, 71460],
    yield: 2,
    sellPrice: 29,
    xp: 17,
    desc: 'Giống Dừa vùng Đông.'
  },
  {
    id: 'qua-175',
    icon: '🔴',
    name: 'Dừa Cao Nguyên',
    type: 'qua',
    seedPrice: 115,
    growTime: 44931,
    growStages: [31320, 34375, 37613, 44931],
    yield: 3,
    sellPrice: 30,
    xp: 18,
    desc: 'Giống Dừa vùng Cao Nguyên.'
  },
  {
    id: 'qua-176',
    icon: '🍒',
    name: 'Dừa Đồng Bằng',
    type: 'qua',
    seedPrice: 116,
    growTime: 54588,
    growStages: [29720, 30886, 35996, 54588],
    yield: 4,
    sellPrice: 31,
    xp: 19,
    desc: 'Giống Dừa vùng Đồng Bằng.'
  },
  {
    id: 'qua-177',
    icon: '🥥',
    name: 'Dừa Núi',
    type: 'qua',
    seedPrice: 117,
    growTime: 42363,
    growStages: [26540, 29744, 38156, 42363],
    yield: 5,
    sellPrice: 32,
    xp: 20,
    desc: 'Giống Dừa vùng Núi.'
  },
  {
    id: 'qua-178',
    icon: '🍈',
    name: 'Dừa Biển',
    type: 'qua',
    seedPrice: 118,
    growTime: 41215,
    growStages: [27642, 31316, 39272, 41215],
    yield: 6,
    sellPrice: 33,
    xp: 21,
    desc: 'Giống Dừa vùng Biển.'
  },
  {
    id: 'qua-179',
    icon: '🍋',
    name: 'Dừa Rừng',
    type: 'qua',
    seedPrice: 119,
    growTime: 36172,
    growStages: [16250, 17574, 29600, 36172],
    yield: 7,
    sellPrice: 34,
    xp: 22,
    desc: 'Giống Dừa vùng Rừng.'
  },
  {
    id: 'qua-180',
    icon: '🍊',
    name: 'Dừa Vườn',
    type: 'qua',
    seedPrice: 120,
    growTime: 46957,
    growStages: [28074, 28904, 32273, 46957],
    yield: 2,
    sellPrice: 35,
    xp: 5,
    desc: 'Giống Dừa vùng Vườn.'
  },
  {
    id: 'qua-181',
    icon: '🍎',
    name: 'Sầu Riêng Nam',
    type: 'qua',
    seedPrice: 121,
    growTime: 23893,
    growStages: [606, 5617, 11212, 23893],
    yield: 3,
    sellPrice: 36,
    xp: 6,
    desc: 'Giống Sầu Riêng vùng Nam.'
  },
  {
    id: 'qua-182',
    icon: '🍌',
    name: 'Sầu Riêng Bắc',
    type: 'qua',
    seedPrice: 122,
    growTime: 49875,
    growStages: [37378, 40553, 42214, 49875],
    yield: 4,
    sellPrice: 37,
    xp: 7,
    desc: 'Giống Sầu Riêng vùng Bắc.'
  },
  {
    id: 'qua-183',
    icon: '🥭',
    name: 'Sầu Riêng Tây',
    type: 'qua',
    seedPrice: 123,
    growTime: 34352,
    growStages: [26262, 31046, 32288, 34352],
    yield: 5,
    sellPrice: 38,
    xp: 8,
    desc: 'Giống Sầu Riêng vùng Tây.'
  },
  {
    id: 'qua-184',
    icon: '🍇',
    name: 'Sầu Riêng Đông',
    type: 'qua',
    seedPrice: 124,
    growTime: 37084,
    growStages: [18011, 23776, 35213, 37084],
    yield: 6,
    sellPrice: 39,
    xp: 9,
    desc: 'Giống Sầu Riêng vùng Đông.'
  },
  {
    id: 'qua-185',
    icon: '🍉',
    name: 'Sầu Riêng Cao Nguyên',
    type: 'qua',
    seedPrice: 125,
    growTime: 43002,
    growStages: [22913, 23335, 33528, 43002],
    yield: 7,
    sellPrice: 40,
    xp: 10,
    desc: 'Giống Sầu Riêng vùng Cao Nguyên.'
  },
  {
    id: 'qua-186',
    icon: '🟢',
    name: 'Sầu Riêng Đồng Bằng',
    type: 'qua',
    seedPrice: 126,
    growTime: 37427,
    growStages: [24237, 25533, 26879, 37427],
    yield: 2,
    sellPrice: 41,
    xp: 11,
    desc: 'Giống Sầu Riêng vùng Đồng Bằng.'
  },
  {
    id: 'qua-187',
    icon: '🍐',
    name: 'Sầu Riêng Núi',
    type: 'qua',
    seedPrice: 127,
    growTime: 37910,
    growStages: [20951, 21124, 34763, 37910],
    yield: 3,
    sellPrice: 42,
    xp: 12,
    desc: 'Giống Sầu Riêng vùng Núi.'
  },
  {
    id: 'qua-188',
    icon: '🍑',
    name: 'Sầu Riêng Biển',
    type: 'qua',
    seedPrice: 128,
    growTime: 52831,
    growStages: [25040, 27524, 32700, 52831],
    yield: 4,
    sellPrice: 43,
    xp: 13,
    desc: 'Giống Sầu Riêng vùng Biển.'
  },
  {
    id: 'qua-189',
    icon: '🟡',
    name: 'Sầu Riêng Rừng',
    type: 'qua',
    seedPrice: 129,
    growTime: 58456,
    growStages: [27627, 31917, 42806, 58456],
    yield: 5,
    sellPrice: 44,
    xp: 14,
    desc: 'Giống Sầu Riêng vùng Rừng.'
  },
  {
    id: 'qua-190',
    icon: '🔴',
    name: 'Sầu Riêng Vườn',
    type: 'qua',
    seedPrice: 130,
    growTime: 34786,
    growStages: [30411, 33685, 33965, 34786],
    yield: 6,
    sellPrice: 45,
    xp: 15,
    desc: 'Giống Sầu Riêng vùng Vườn.'
  },
  {
    id: 'qua-191',
    icon: '🍒',
    name: 'Mãng Cầu Nam',
    type: 'qua',
    seedPrice: 131,
    growTime: 56693,
    growStages: [22313, 27245, 35371, 56693],
    yield: 7,
    sellPrice: 46,
    xp: 16,
    desc: 'Giống Mãng Cầu vùng Nam.'
  },
  {
    id: 'qua-192',
    icon: '🥥',
    name: 'Mãng Cầu Bắc',
    type: 'qua',
    seedPrice: 132,
    growTime: 20115,
    growStages: [7382, 13835, 18591, 20115],
    yield: 2,
    sellPrice: 47,
    xp: 17,
    desc: 'Giống Mãng Cầu vùng Bắc.'
  },
  {
    id: 'qua-193',
    icon: '🍈',
    name: 'Mãng Cầu Tây',
    type: 'qua',
    seedPrice: 133,
    growTime: 68484,
    growStages: [35066, 40106, 53934, 68484],
    yield: 3,
    sellPrice: 48,
    xp: 18,
    desc: 'Giống Mãng Cầu vùng Tây.'
  },
  {
    id: 'qua-194',
    icon: '🍋',
    name: 'Mãng Cầu Đông',
    type: 'qua',
    seedPrice: 134,
    growTime: 49647,
    growStages: [23433, 26430, 28162, 49647],
    yield: 4,
    sellPrice: 49,
    xp: 19,
    desc: 'Giống Mãng Cầu vùng Đông.'
  },
  {
    id: 'qua-195',
    icon: '🍊',
    name: 'Mãng Cầu Cao Nguyên',
    type: 'qua',
    seedPrice: 135,
    growTime: 57843,
    growStages: [36801, 43833, 47693, 57843],
    yield: 5,
    sellPrice: 50,
    xp: 20,
    desc: 'Giống Mãng Cầu vùng Cao Nguyên.'
  },
  {
    id: 'qua-196',
    icon: '🍎',
    name: 'Mãng Cầu Đồng Bằng',
    type: 'qua',
    seedPrice: 136,
    growTime: 34917,
    growStages: [1865, 6070, 19417, 34917],
    yield: 6,
    sellPrice: 51,
    xp: 21,
    desc: 'Giống Mãng Cầu vùng Đồng Bằng.'
  },
  {
    id: 'qua-197',
    icon: '🍌',
    name: 'Mãng Cầu Núi',
    type: 'qua',
    seedPrice: 137,
    growTime: 41456,
    growStages: [17911, 19202, 29617, 41456],
    yield: 7,
    sellPrice: 52,
    xp: 22,
    desc: 'Giống Mãng Cầu vùng Núi.'
  },
  {
    id: 'qua-198',
    icon: '🥭',
    name: 'Mãng Cầu Biển',
    type: 'qua',
    seedPrice: 138,
    growTime: 9341,
    growStages: [1865, 7512, 8019, 9341],
    yield: 2,
    sellPrice: 53,
    xp: 5,
    desc: 'Giống Mãng Cầu vùng Biển.'
  },
  {
    id: 'qua-199',
    icon: '🍇',
    name: 'Mãng Cầu Rừng',
    type: 'qua',
    seedPrice: 139,
    growTime: 61309,
    growStages: [40983, 43758, 51504, 61309],
    yield: 3,
    sellPrice: 54,
    xp: 6,
    desc: 'Giống Mãng Cầu vùng Rừng.'
  },
  {
    id: 'qua-200',
    icon: '🍉',
    name: 'Mãng Cầu Vườn',
    type: 'qua',
    seedPrice: 40,
    growTime: 16467,
    growStages: [102, 3897, 7650, 16467],
    yield: 4,
    sellPrice: 15,
    xp: 7,
    desc: 'Giống Mãng Cầu vùng Vườn.'
  },
  {
    id: 'qua-201',
    icon: '🟢',
    name: 'Bưởi Nam',
    type: 'qua',
    seedPrice: 41,
    growTime: 25715,
    growStages: [2787, 3202, 12287, 25715],
    yield: 5,
    sellPrice: 16,
    xp: 8,
    desc: 'Giống Bưởi vùng Nam.'
  },
  {
    id: 'qua-202',
    icon: '🍐',
    name: 'Bưởi Bắc',
    type: 'qua',
    seedPrice: 42,
    growTime: 38318,
    growStages: [25563, 25848, 30859, 38318],
    yield: 6,
    sellPrice: 17,
    xp: 9,
    desc: 'Giống Bưởi vùng Bắc.'
  },
  {
    id: 'qua-203',
    icon: '🍑',
    name: 'Bưởi Tây',
    type: 'qua',
    seedPrice: 43,
    growTime: 35560,
    growStages: [14302, 16223, 26781, 35560],
    yield: 7,
    sellPrice: 18,
    xp: 10,
    desc: 'Giống Bưởi vùng Tây.'
  },
  {
    id: 'qua-204',
    icon: '🟡',
    name: 'Bưởi Đông',
    type: 'qua',
    seedPrice: 44,
    growTime: 41022,
    growStages: [19222, 22399, 27863, 41022],
    yield: 2,
    sellPrice: 19,
    xp: 11,
    desc: 'Giống Bưởi vùng Đông.'
  },
  {
    id: 'qua-205',
    icon: '🔴',
    name: 'Bưởi Cao Nguyên',
    type: 'qua',
    seedPrice: 45,
    growTime: 11516,
    growStages: [2426, 3367, 10835, 11516],
    yield: 3,
    sellPrice: 20,
    xp: 12,
    desc: 'Giống Bưởi vùng Cao Nguyên.'
  },
  {
    id: 'qua-206',
    icon: '🍒',
    name: 'Bưởi Đồng Bằng',
    type: 'qua',
    seedPrice: 46,
    growTime: 31493,
    growStages: [3249, 4417, 11212, 31493],
    yield: 4,
    sellPrice: 21,
    xp: 13,
    desc: 'Giống Bưởi vùng Đồng Bằng.'
  },
  {
    id: 'qua-207',
    icon: '🥥',
    name: 'Bưởi Núi',
    type: 'qua',
    seedPrice: 47,
    growTime: 40097,
    growStages: [36897, 37232, 39709, 40097],
    yield: 5,
    sellPrice: 22,
    xp: 14,
    desc: 'Giống Bưởi vùng Núi.'
  },
  {
    id: 'qua-208',
    icon: '🍈',
    name: 'Bưởi Biển',
    type: 'qua',
    seedPrice: 48,
    growTime: 65300,
    growStages: [28877, 35784, 44894, 65300],
    yield: 6,
    sellPrice: 23,
    xp: 15,
    desc: 'Giống Bưởi vùng Biển.'
  },
  {
    id: 'qua-209',
    icon: '🍋',
    name: 'Bưởi Rừng',
    type: 'qua',
    seedPrice: 49,
    growTime: 42213,
    growStages: [9210, 14287, 21323, 42213],
    yield: 7,
    sellPrice: 24,
    xp: 16,
    desc: 'Giống Bưởi vùng Rừng.'
  },
  {
    id: 'qua-210',
    icon: '🍊',
    name: 'Bưởi Vườn',
    type: 'qua',
    seedPrice: 50,
    growTime: 66756,
    growStages: [42175, 47377, 58600, 66756],
    yield: 2,
    sellPrice: 25,
    xp: 17,
    desc: 'Giống Bưởi vùng Vườn.'
  },
  {
    id: 'qua-211',
    icon: '🍎',
    name: 'Quýt Nam',
    type: 'qua',
    seedPrice: 51,
    growTime: 63502,
    growStages: [43098, 47813, 52357, 63502],
    yield: 3,
    sellPrice: 26,
    xp: 18,
    desc: 'Giống Quýt vùng Nam.'
  },
  {
    id: 'qua-212',
    icon: '🍌',
    name: 'Quýt Bắc',
    type: 'qua',
    seedPrice: 52,
    growTime: 10417,
    growStages: [1501, 2939, 7395, 10417],
    yield: 4,
    sellPrice: 27,
    xp: 19,
    desc: 'Giống Quýt vùng Bắc.'
  },
  {
    id: 'qua-213',
    icon: '🥭',
    name: 'Quýt Tây',
    type: 'qua',
    seedPrice: 53,
    growTime: 27742,
    growStages: [13661, 19403, 25166, 27742],
    yield: 5,
    sellPrice: 28,
    xp: 20,
    desc: 'Giống Quýt vùng Tây.'
  },
  {
    id: 'qua-214',
    icon: '🍇',
    name: 'Quýt Đông',
    type: 'qua',
    seedPrice: 54,
    growTime: 49720,
    growStages: [32694, 35311, 43421, 49720],
    yield: 6,
    sellPrice: 29,
    xp: 21,
    desc: 'Giống Quýt vùng Đông.'
  },
  {
    id: 'qua-215',
    icon: '🍉',
    name: 'Quýt Cao Nguyên',
    type: 'qua',
    seedPrice: 55,
    growTime: 44616,
    growStages: [24689, 31650, 32233, 44616],
    yield: 7,
    sellPrice: 30,
    xp: 22,
    desc: 'Giống Quýt vùng Cao Nguyên.'
  },
  {
    id: 'qua-216',
    icon: '🟢',
    name: 'Quýt Đồng Bằng',
    type: 'qua',
    seedPrice: 56,
    growTime: 19356,
    growStages: [1863, 5938, 8038, 19356],
    yield: 2,
    sellPrice: 31,
    xp: 5,
    desc: 'Giống Quýt vùng Đồng Bằng.'
  },
  {
    id: 'qua-217',
    icon: '🍐',
    name: 'Quýt Núi',
    type: 'qua',
    seedPrice: 57,
    growTime: 43187,
    growStages: [37431, 38426, 40953, 43187],
    yield: 3,
    sellPrice: 32,
    xp: 6,
    desc: 'Giống Quýt vùng Núi.'
  },
  {
    id: 'qua-218',
    icon: '🍑',
    name: 'Quýt Biển',
    type: 'qua',
    seedPrice: 58,
    growTime: 38388,
    growStages: [19667, 24954, 33109, 38388],
    yield: 4,
    sellPrice: 33,
    xp: 7,
    desc: 'Giống Quýt vùng Biển.'
  },
  {
    id: 'qua-219',
    icon: '🟡',
    name: 'Quýt Rừng',
    type: 'qua',
    seedPrice: 59,
    growTime: 31911,
    growStages: [16727, 19364, 22586, 31911],
    yield: 5,
    sellPrice: 34,
    xp: 8,
    desc: 'Giống Quýt vùng Rừng.'
  },
  {
    id: 'qua-220',
    icon: '🔴',
    name: 'Quýt Vườn',
    type: 'qua',
    seedPrice: 60,
    growTime: 37568,
    growStages: [8290, 9077, 23427, 37568],
    yield: 6,
    sellPrice: 35,
    xp: 9,
    desc: 'Giống Quýt vùng Vườn.'
  },
  {
    id: 'qua-221',
    icon: '🍒',
    name: 'Chanh Nam',
    type: 'qua',
    seedPrice: 61,
    growTime: 52881,
    growStages: [24344, 30357, 41412, 52881],
    yield: 7,
    sellPrice: 36,
    xp: 10,
    desc: 'Giống Chanh vùng Nam.'
  },
  {
    id: 'qua-222',
    icon: '🥥',
    name: 'Chanh Bắc',
    type: 'qua',
    seedPrice: 62,
    growTime: 56402,
    growStages: [37175, 43378, 49516, 56402],
    yield: 2,
    sellPrice: 37,
    xp: 11,
    desc: 'Giống Chanh vùng Bắc.'
  },
  {
    id: 'qua-223',
    icon: '🍈',
    name: 'Chanh Tây',
    type: 'qua',
    seedPrice: 63,
    growTime: 36738,
    growStages: [21041, 25866, 28030, 36738],
    yield: 3,
    sellPrice: 38,
    xp: 12,
    desc: 'Giống Chanh vùng Tây.'
  },
  {
    id: 'qua-224',
    icon: '🍋',
    name: 'Chanh Đông',
    type: 'qua',
    seedPrice: 64,
    growTime: 44113,
    growStages: [15852, 21687, 29008, 44113],
    yield: 4,
    sellPrice: 39,
    xp: 13,
    desc: 'Giống Chanh vùng Đông.'
  },
  {
    id: 'qua-225',
    icon: '🍊',
    name: 'Chanh Cao Nguyên',
    type: 'qua',
    seedPrice: 65,
    growTime: 28399,
    growStages: [10112, 10579, 15524, 28399],
    yield: 5,
    sellPrice: 40,
    xp: 14,
    desc: 'Giống Chanh vùng Cao Nguyên.'
  },
  {
    id: 'qua-226',
    icon: '🍎',
    name: 'Chanh Đồng Bằng',
    type: 'qua',
    seedPrice: 66,
    growTime: 27265,
    growStages: [2810, 8802, 19306, 27265],
    yield: 6,
    sellPrice: 41,
    xp: 15,
    desc: 'Giống Chanh vùng Đồng Bằng.'
  },
  {
    id: 'qua-227',
    icon: '🍌',
    name: 'Chanh Núi',
    type: 'qua',
    seedPrice: 67,
    growTime: 25105,
    growStages: [11594, 13703, 15336, 25105],
    yield: 7,
    sellPrice: 42,
    xp: 16,
    desc: 'Giống Chanh vùng Núi.'
  },
  {
    id: 'qua-228',
    icon: '🥭',
    name: 'Chanh Biển',
    type: 'qua',
    seedPrice: 68,
    growTime: 42222,
    growStages: [24479, 29536, 31310, 42222],
    yield: 2,
    sellPrice: 43,
    xp: 17,
    desc: 'Giống Chanh vùng Biển.'
  },
  {
    id: 'qua-229',
    icon: '🍇',
    name: 'Chanh Rừng',
    type: 'qua',
    seedPrice: 69,
    growTime: 43204,
    growStages: [15516, 21604, 24502, 43204],
    yield: 3,
    sellPrice: 44,
    xp: 18,
    desc: 'Giống Chanh vùng Rừng.'
  },
  {
    id: 'qua-230',
    icon: '🍉',
    name: 'Chanh Vườn',
    type: 'qua',
    seedPrice: 70,
    growTime: 35703,
    growStages: [14756, 19568, 24642, 35703],
    yield: 4,
    sellPrice: 45,
    xp: 19,
    desc: 'Giống Chanh vùng Vườn.'
  },
  {
    id: 'qua-231',
    icon: '🟢',
    name: 'Me Nam',
    type: 'qua',
    seedPrice: 71,
    growTime: 47742,
    growStages: [18109, 19451, 33552, 47742],
    yield: 5,
    sellPrice: 46,
    xp: 20,
    desc: 'Giống Me vùng Nam.'
  },
  {
    id: 'qua-232',
    icon: '🍐',
    name: 'Me Bắc',
    type: 'qua',
    seedPrice: 72,
    growTime: 62839,
    growStages: [42007, 45161, 58140, 62839],
    yield: 6,
    sellPrice: 47,
    xp: 21,
    desc: 'Giống Me vùng Bắc.'
  },
  {
    id: 'qua-233',
    icon: '🍑',
    name: 'Me Tây',
    type: 'qua',
    seedPrice: 73,
    growTime: 24067,
    growStages: [2411, 2953, 11665, 24067],
    yield: 7,
    sellPrice: 48,
    xp: 22,
    desc: 'Giống Me vùng Tây.'
  },
  {
    id: 'qua-234',
    icon: '🟡',
    name: 'Me Đông',
    type: 'qua',
    seedPrice: 74,
    growTime: 29056,
    growStages: [17308, 23742, 28595, 29056],
    yield: 2,
    sellPrice: 49,
    xp: 5,
    desc: 'Giống Me vùng Đông.'
  },
  {
    id: 'qua-235',
    icon: '🔴',
    name: 'Me Cao Nguyên',
    type: 'qua',
    seedPrice: 75,
    growTime: 50319,
    growStages: [23376, 24628, 37371, 50319],
    yield: 3,
    sellPrice: 50,
    xp: 6,
    desc: 'Giống Me vùng Cao Nguyên.'
  },
  {
    id: 'qua-236',
    icon: '🍒',
    name: 'Me Đồng Bằng',
    type: 'qua',
    seedPrice: 76,
    growTime: 32792,
    growStages: [13294, 16377, 19738, 32792],
    yield: 4,
    sellPrice: 51,
    xp: 7,
    desc: 'Giống Me vùng Đồng Bằng.'
  },
  {
    id: 'qua-237',
    icon: '🥥',
    name: 'Me Núi',
    type: 'qua',
    seedPrice: 77,
    growTime: 62258,
    growStages: [38894, 41399, 47974, 62258],
    yield: 5,
    sellPrice: 52,
    xp: 8,
    desc: 'Giống Me vùng Núi.'
  },
  {
    id: 'qua-238',
    icon: '🍈',
    name: 'Me Biển',
    type: 'qua',
    seedPrice: 78,
    growTime: 74824,
    growStages: [40579, 43330, 56349, 74824],
    yield: 6,
    sellPrice: 53,
    xp: 9,
    desc: 'Giống Me vùng Biển.'
  },
  {
    id: 'qua-239',
    icon: '🍋',
    name: 'Me Rừng',
    type: 'qua',
    seedPrice: 79,
    growTime: 31830,
    growStages: [5354, 12408, 25380, 31830],
    yield: 7,
    sellPrice: 54,
    xp: 10,
    desc: 'Giống Me vùng Rừng.'
  },
  {
    id: 'qua-240',
    icon: '🍊',
    name: 'Me Vườn',
    type: 'qua',
    seedPrice: 80,
    growTime: 52219,
    growStages: [28681, 30391, 31997, 52219],
    yield: 2,
    sellPrice: 15,
    xp: 11,
    desc: 'Giống Me vùng Vườn.'
  },
  {
    id: 'qua-241',
    icon: '🍎',
    name: 'Roi Nam',
    type: 'qua',
    seedPrice: 81,
    growTime: 34299,
    growStages: [1725, 4714, 17948, 34299],
    yield: 3,
    sellPrice: 16,
    xp: 12,
    desc: 'Giống Roi vùng Nam.'
  },
  {
    id: 'qua-242',
    icon: '🍌',
    name: 'Roi Bắc',
    type: 'qua',
    seedPrice: 82,
    growTime: 64764,
    growStages: [41775, 43041, 43722, 64764],
    yield: 4,
    sellPrice: 17,
    xp: 13,
    desc: 'Giống Roi vùng Bắc.'
  },
  {
    id: 'qua-243',
    icon: '🥭',
    name: 'Roi Tây',
    type: 'qua',
    seedPrice: 83,
    growTime: 51861,
    growStages: [28680, 33856, 37408, 51861],
    yield: 5,
    sellPrice: 18,
    xp: 14,
    desc: 'Giống Roi vùng Tây.'
  },
  {
    id: 'qua-244',
    icon: '🍇',
    name: 'Roi Đông',
    type: 'qua',
    seedPrice: 84,
    growTime: 25520,
    growStages: [11724, 12968, 15126, 25520],
    yield: 6,
    sellPrice: 19,
    xp: 15,
    desc: 'Giống Roi vùng Đông.'
  },
  {
    id: 'qua-245',
    icon: '🍉',
    name: 'Roi Cao Nguyên',
    type: 'qua',
    seedPrice: 85,
    growTime: 56056,
    growStages: [29196, 34044, 43220, 56056],
    yield: 7,
    sellPrice: 20,
    xp: 16,
    desc: 'Giống Roi vùng Cao Nguyên.'
  },
  {
    id: 'qua-246',
    icon: '🟢',
    name: 'Roi Đồng Bằng',
    type: 'qua',
    seedPrice: 86,
    growTime: 22145,
    growStages: [192, 4195, 5429, 22145],
    yield: 2,
    sellPrice: 21,
    xp: 17,
    desc: 'Giống Roi vùng Đồng Bằng.'
  },
  {
    id: 'qua-247',
    icon: '🍐',
    name: 'Roi Núi',
    type: 'qua',
    seedPrice: 87,
    growTime: 46798,
    growStages: [34239, 39815, 40380, 46798],
    yield: 3,
    sellPrice: 22,
    xp: 18,
    desc: 'Giống Roi vùng Núi.'
  },
  {
    id: 'qua-248',
    icon: '🍑',
    name: 'Roi Biển',
    type: 'qua',
    seedPrice: 88,
    growTime: 49236,
    growStages: [31603, 34307, 36715, 49236],
    yield: 4,
    sellPrice: 23,
    xp: 19,
    desc: 'Giống Roi vùng Biển.'
  },
  {
    id: 'qua-249',
    icon: '🟡',
    name: 'Roi Rừng',
    type: 'qua',
    seedPrice: 89,
    growTime: 57874,
    growStages: [36090, 40442, 40562, 57874],
    yield: 5,
    sellPrice: 24,
    xp: 20,
    desc: 'Giống Roi vùng Rừng.'
  },
  {
    id: 'qua-250',
    icon: '🔴',
    name: 'Roi Vườn',
    type: 'qua',
    seedPrice: 90,
    growTime: 30426,
    growStages: [9541, 10495, 18892, 30426],
    yield: 6,
    sellPrice: 25,
    xp: 21,
    desc: 'Giống Roi vùng Vườn.'
  },
  {
    id: 'qua-251',
    icon: '🍒',
    name: 'Thanh Long Nam',
    type: 'qua',
    seedPrice: 91,
    growTime: 38302,
    growStages: [26705, 27417, 32614, 38302],
    yield: 7,
    sellPrice: 26,
    xp: 22,
    desc: 'Giống Thanh Long vùng Nam.'
  },
  {
    id: 'qua-252',
    icon: '🥥',
    name: 'Thanh Long Bắc',
    type: 'qua',
    seedPrice: 92,
    growTime: 36074,
    growStages: [20167, 24853, 32853, 36074],
    yield: 2,
    sellPrice: 27,
    xp: 5,
    desc: 'Giống Thanh Long vùng Bắc.'
  },
  {
    id: 'qua-253',
    icon: '🍈',
    name: 'Thanh Long Tây',
    type: 'qua',
    seedPrice: 93,
    growTime: 60187,
    growStages: [27164, 30836, 44919, 60187],
    yield: 3,
    sellPrice: 28,
    xp: 6,
    desc: 'Giống Thanh Long vùng Tây.'
  },
  {
    id: 'qua-254',
    icon: '🍋',
    name: 'Thanh Long Đông',
    type: 'qua',
    seedPrice: 94,
    growTime: 46332,
    growStages: [24821, 25679, 34575, 46332],
    yield: 4,
    sellPrice: 29,
    xp: 7,
    desc: 'Giống Thanh Long vùng Đông.'
  },
  {
    id: 'qua-255',
    icon: '🍊',
    name: 'Thanh Long Cao Nguyên',
    type: 'qua',
    seedPrice: 95,
    growTime: 65498,
    growStages: [29955, 36907, 50915, 65498],
    yield: 5,
    sellPrice: 30,
    xp: 8,
    desc: 'Giống Thanh Long vùng Cao Nguyên.'
  },
  {
    id: 'qua-256',
    icon: '🍎',
    name: 'Thanh Long Đồng Bằng',
    type: 'qua',
    seedPrice: 96,
    growTime: 48046,
    growStages: [30124, 33493, 42518, 48046],
    yield: 6,
    sellPrice: 31,
    xp: 9,
    desc: 'Giống Thanh Long vùng Đồng Bằng.'
  },
  {
    id: 'qua-257',
    icon: '🍌',
    name: 'Thanh Long Núi',
    type: 'qua',
    seedPrice: 97,
    growTime: 51659,
    growStages: [31871, 33952, 35226, 51659],
    yield: 7,
    sellPrice: 32,
    xp: 10,
    desc: 'Giống Thanh Long vùng Núi.'
  },
  {
    id: 'qua-258',
    icon: '🥭',
    name: 'Thanh Long Biển',
    type: 'qua',
    seedPrice: 98,
    growTime: 45328,
    growStages: [12723, 17601, 24171, 45328],
    yield: 2,
    sellPrice: 33,
    xp: 11,
    desc: 'Giống Thanh Long vùng Biển.'
  },
  {
    id: 'qua-259',
    icon: '🍇',
    name: 'Thanh Long Rừng',
    type: 'qua',
    seedPrice: 99,
    growTime: 65024,
    growStages: [30225, 34047, 47526, 65024],
    yield: 3,
    sellPrice: 34,
    xp: 12,
    desc: 'Giống Thanh Long vùng Rừng.'
  },
  {
    id: 'qua-260',
    icon: '🍉',
    name: 'Thanh Long Vườn',
    type: 'qua',
    seedPrice: 100,
    growTime: 52120,
    growStages: [31978, 32579, 43503, 52120],
    yield: 4,
    sellPrice: 35,
    xp: 13,
    desc: 'Giống Thanh Long vùng Vườn.'
  },
  {
    id: 'qua-261',
    icon: '🟢',
    name: 'Mận Nam',
    type: 'qua',
    seedPrice: 101,
    growTime: 65753,
    growStages: [41222, 42639, 44297, 65753],
    yield: 5,
    sellPrice: 36,
    xp: 14,
    desc: 'Giống Mận vùng Nam.'
  },
  {
    id: 'qua-262',
    icon: '🍐',
    name: 'Mận Bắc',
    type: 'qua',
    seedPrice: 102,
    growTime: 43233,
    growStages: [19176, 19337, 26302, 43233],
    yield: 6,
    sellPrice: 37,
    xp: 15,
    desc: 'Giống Mận vùng Bắc.'
  },
  {
    id: 'qua-263',
    icon: '🍑',
    name: 'Mận Tây',
    type: 'qua',
    seedPrice: 103,
    growTime: 15722,
    growStages: [8013, 11981, 12213, 15722],
    yield: 7,
    sellPrice: 38,
    xp: 16,
    desc: 'Giống Mận vùng Tây.'
  },
  {
    id: 'qua-264',
    icon: '🟡',
    name: 'Mận Đông',
    type: 'qua',
    seedPrice: 104,
    growTime: 49216,
    growStages: [14220, 16532, 28589, 49216],
    yield: 2,
    sellPrice: 39,
    xp: 17,
    desc: 'Giống Mận vùng Đông.'
  },
  {
    id: 'qua-265',
    icon: '🔴',
    name: 'Mận Cao Nguyên',
    type: 'qua',
    seedPrice: 105,
    growTime: 69841,
    growStages: [43098, 50090, 62562, 69841],
    yield: 3,
    sellPrice: 40,
    xp: 18,
    desc: 'Giống Mận vùng Cao Nguyên.'
  },
  {
    id: 'qua-266',
    icon: '🍒',
    name: 'Mận Đồng Bằng',
    type: 'qua',
    seedPrice: 106,
    growTime: 46538,
    growStages: [16437, 21201, 30387, 46538],
    yield: 4,
    sellPrice: 41,
    xp: 19,
    desc: 'Giống Mận vùng Đồng Bằng.'
  },
  {
    id: 'qua-267',
    icon: '🥥',
    name: 'Mận Núi',
    type: 'qua',
    seedPrice: 107,
    growTime: 40119,
    growStages: [11419, 14861, 25733, 40119],
    yield: 5,
    sellPrice: 42,
    xp: 20,
    desc: 'Giống Mận vùng Núi.'
  },
  {
    id: 'qua-268',
    icon: '🍈',
    name: 'Mận Biển',
    type: 'qua',
    seedPrice: 108,
    growTime: 45386,
    growStages: [15290, 18106, 31566, 45386],
    yield: 6,
    sellPrice: 43,
    xp: 21,
    desc: 'Giống Mận vùng Biển.'
  },
  {
    id: 'qua-269',
    icon: '🍋',
    name: 'Mận Rừng',
    type: 'qua',
    seedPrice: 109,
    growTime: 27574,
    growStages: [5546, 5637, 14448, 27574],
    yield: 7,
    sellPrice: 44,
    xp: 22,
    desc: 'Giống Mận vùng Rừng.'
  },
  {
    id: 'qua-270',
    icon: '🍊',
    name: 'Mận Vườn',
    type: 'qua',
    seedPrice: 110,
    growTime: 38169,
    growStages: [7584, 8507, 16965, 38169],
    yield: 2,
    sellPrice: 45,
    xp: 5,
    desc: 'Giống Mận vùng Vườn.'
  },
  {
    id: 'qua-271',
    icon: '🍎',
    name: 'Hồng Xiêm Nam',
    type: 'qua',
    seedPrice: 111,
    growTime: 51345,
    growStages: [23477, 29867, 34732, 51345],
    yield: 3,
    sellPrice: 46,
    xp: 6,
    desc: 'Giống Hồng Xiêm vùng Nam.'
  },
  {
    id: 'qua-272',
    icon: '🍌',
    name: 'Hồng Xiêm Bắc',
    type: 'qua',
    seedPrice: 112,
    growTime: 37032,
    growStages: [16810, 18436, 21603, 37032],
    yield: 4,
    sellPrice: 47,
    xp: 7,
    desc: 'Giống Hồng Xiêm vùng Bắc.'
  },
  {
    id: 'qua-273',
    icon: '🥭',
    name: 'Hồng Xiêm Tây',
    type: 'qua',
    seedPrice: 113,
    growTime: 25479,
    growStages: [1268, 2056, 10534, 25479],
    yield: 5,
    sellPrice: 48,
    xp: 8,
    desc: 'Giống Hồng Xiêm vùng Tây.'
  },
  {
    id: 'qua-274',
    icon: '🍇',
    name: 'Hồng Xiêm Đông',
    type: 'qua',
    seedPrice: 114,
    growTime: 45296,
    growStages: [16228, 20852, 31335, 45296],
    yield: 6,
    sellPrice: 49,
    xp: 9,
    desc: 'Giống Hồng Xiêm vùng Đông.'
  },
  {
    id: 'qua-275',
    icon: '🍉',
    name: 'Hồng Xiêm Cao Nguyên',
    type: 'qua',
    seedPrice: 115,
    growTime: 54274,
    growStages: [28735, 35126, 39553, 54274],
    yield: 7,
    sellPrice: 50,
    xp: 10,
    desc: 'Giống Hồng Xiêm vùng Cao Nguyên.'
  },
  {
    id: 'qua-276',
    icon: '🟢',
    name: 'Hồng Xiêm Đồng Bằng',
    type: 'qua',
    seedPrice: 116,
    growTime: 39115,
    growStages: [9947, 13496, 27605, 39115],
    yield: 2,
    sellPrice: 51,
    xp: 11,
    desc: 'Giống Hồng Xiêm vùng Đồng Bằng.'
  },
  {
    id: 'qua-277',
    icon: '🍐',
    name: 'Hồng Xiêm Núi',
    type: 'qua',
    seedPrice: 117,
    growTime: 62600,
    growStages: [33232, 37148, 45108, 62600],
    yield: 3,
    sellPrice: 52,
    xp: 12,
    desc: 'Giống Hồng Xiêm vùng Núi.'
  },
  {
    id: 'qua-278',
    icon: '🍑',
    name: 'Hồng Xiêm Biển',
    type: 'qua',
    seedPrice: 118,
    growTime: 29402,
    growStages: [8779, 15707, 23505, 29402],
    yield: 4,
    sellPrice: 53,
    xp: 13,
    desc: 'Giống Hồng Xiêm vùng Biển.'
  },
  {
    id: 'qua-279',
    icon: '🟡',
    name: 'Hồng Xiêm Rừng',
    type: 'qua',
    seedPrice: 119,
    growTime: 31040,
    growStages: [14138, 19504, 23157, 31040],
    yield: 5,
    sellPrice: 54,
    xp: 14,
    desc: 'Giống Hồng Xiêm vùng Rừng.'
  },
  {
    id: 'qua-280',
    icon: '🔴',
    name: 'Hồng Xiêm Vườn',
    type: 'qua',
    seedPrice: 120,
    growTime: 27670,
    growStages: [9756, 15282, 24265, 27670],
    yield: 6,
    sellPrice: 15,
    xp: 15,
    desc: 'Giống Hồng Xiêm vùng Vườn.'
  },
  {
    id: 'qua-281',
    icon: '🍒',
    name: 'Sung Nam',
    type: 'qua',
    seedPrice: 121,
    growTime: 34418,
    growStages: [2298, 4916, 16258, 34418],
    yield: 7,
    sellPrice: 16,
    xp: 16,
    desc: 'Giống Sung vùng Nam.'
  },
  {
    id: 'qua-282',
    icon: '🥥',
    name: 'Sung Bắc',
    type: 'qua',
    seedPrice: 122,
    growTime: 51731,
    growStages: [32762, 37098, 50824, 51731],
    yield: 2,
    sellPrice: 17,
    xp: 17,
    desc: 'Giống Sung vùng Bắc.'
  },
  {
    id: 'qua-283',
    icon: '🍈',
    name: 'Sung Tây',
    type: 'qua',
    seedPrice: 123,
    growTime: 50330,
    growStages: [18253, 23293, 33617, 50330],
    yield: 3,
    sellPrice: 18,
    xp: 18,
    desc: 'Giống Sung vùng Tây.'
  },
  {
    id: 'qua-284',
    icon: '🍋',
    name: 'Sung Đông',
    type: 'qua',
    seedPrice: 124,
    growTime: 40018,
    growStages: [20495, 21362, 24417, 40018],
    yield: 4,
    sellPrice: 19,
    xp: 19,
    desc: 'Giống Sung vùng Đông.'
  },
  {
    id: 'qua-285',
    icon: '🍊',
    name: 'Sung Cao Nguyên',
    type: 'qua',
    seedPrice: 125,
    growTime: 17171,
    growStages: [555, 5961, 9495, 17171],
    yield: 5,
    sellPrice: 20,
    xp: 20,
    desc: 'Giống Sung vùng Cao Nguyên.'
  },
  {
    id: 'qua-286',
    icon: '🍎',
    name: 'Sung Đồng Bằng',
    type: 'qua',
    seedPrice: 126,
    growTime: 23196,
    growStages: [593, 890, 8878, 23196],
    yield: 6,
    sellPrice: 21,
    xp: 21,
    desc: 'Giống Sung vùng Đồng Bằng.'
  },
  {
    id: 'qua-287',
    icon: '🍌',
    name: 'Sung Núi',
    type: 'qua',
    seedPrice: 127,
    growTime: 62351,
    growStages: [40981, 45855, 54102, 62351],
    yield: 7,
    sellPrice: 22,
    xp: 22,
    desc: 'Giống Sung vùng Núi.'
  },
  {
    id: 'qua-288',
    icon: '🥭',
    name: 'Sung Biển',
    type: 'qua',
    seedPrice: 128,
    growTime: 22829,
    growStages: [7430, 11268, 19234, 22829],
    yield: 2,
    sellPrice: 23,
    xp: 5,
    desc: 'Giống Sung vùng Biển.'
  },
  {
    id: 'qua-289',
    icon: '🍇',
    name: 'Sung Rừng',
    type: 'qua',
    seedPrice: 129,
    growTime: 30727,
    growStages: [13592, 18953, 29295, 30727],
    yield: 3,
    sellPrice: 24,
    xp: 6,
    desc: 'Giống Sung vùng Rừng.'
  },
  {
    id: 'qua-290',
    icon: '🍉',
    name: 'Sung Vườn',
    type: 'qua',
    seedPrice: 130,
    growTime: 53773,
    growStages: [29874, 31456, 38878, 53773],
    yield: 4,
    sellPrice: 25,
    xp: 7,
    desc: 'Giống Sung vùng Vườn.'
  },
  {
    id: 'qua-291',
    icon: '🟢',
    name: 'Na Nam',
    type: 'qua',
    seedPrice: 131,
    growTime: 16083,
    growStages: [4693, 5993, 8222, 16083],
    yield: 5,
    sellPrice: 26,
    xp: 8,
    desc: 'Giống Na vùng Nam.'
  },
  {
    id: 'qua-292',
    icon: '🍐',
    name: 'Na Bắc',
    type: 'qua',
    seedPrice: 132,
    growTime: 58358,
    growStages: [30953, 33281, 40991, 58358],
    yield: 6,
    sellPrice: 27,
    xp: 9,
    desc: 'Giống Na vùng Bắc.'
  },
  {
    id: 'qua-293',
    icon: '🍑',
    name: 'Na Tây',
    type: 'qua',
    seedPrice: 133,
    growTime: 45705,
    growStages: [28042, 35028, 42188, 45705],
    yield: 7,
    sellPrice: 28,
    xp: 10,
    desc: 'Giống Na vùng Tây.'
  },
  {
    id: 'qua-294',
    icon: '🟡',
    name: 'Na Đông',
    type: 'qua',
    seedPrice: 134,
    growTime: 54414,
    growStages: [39993, 43329, 53069, 54414],
    yield: 2,
    sellPrice: 29,
    xp: 11,
    desc: 'Giống Na vùng Đông.'
  },
  {
    id: 'qua-295',
    icon: '🔴',
    name: 'Na Cao Nguyên',
    type: 'qua',
    seedPrice: 135,
    growTime: 64155,
    growStages: [38130, 43784, 50401, 64155],
    yield: 3,
    sellPrice: 30,
    xp: 12,
    desc: 'Giống Na vùng Cao Nguyên.'
  },
  {
    id: 'qua-296',
    icon: '🍒',
    name: 'Na Đồng Bằng',
    type: 'qua',
    seedPrice: 136,
    growTime: 44953,
    growStages: [22860, 27890, 36496, 44953],
    yield: 4,
    sellPrice: 31,
    xp: 13,
    desc: 'Giống Na vùng Đồng Bằng.'
  },
  {
    id: 'qua-297',
    icon: '🥥',
    name: 'Na Núi',
    type: 'qua',
    seedPrice: 137,
    growTime: 20537,
    growStages: [7162, 9204, 9953, 20537],
    yield: 5,
    sellPrice: 32,
    xp: 14,
    desc: 'Giống Na vùng Núi.'
  },
  {
    id: 'qua-298',
    icon: '🍈',
    name: 'Na Biển',
    type: 'qua',
    seedPrice: 138,
    growTime: 70842,
    growStages: [41772, 43834, 55166, 70842],
    yield: 6,
    sellPrice: 33,
    xp: 15,
    desc: 'Giống Na vùng Biển.'
  },
  {
    id: 'qua-299',
    icon: '🍋',
    name: 'Na Rừng',
    type: 'qua',
    seedPrice: 139,
    growTime: 47247,
    growStages: [26538, 30632, 34580, 47247],
    yield: 7,
    sellPrice: 34,
    xp: 16,
    desc: 'Giống Na vùng Rừng.'
  },
  {
    id: 'qua-300',
    icon: '🍊',
    name: 'Na Vườn',
    type: 'qua',
    seedPrice: 40,
    growTime: 38583,
    growStages: [18975, 25337, 32194, 38583],
    yield: 2,
    sellPrice: 35,
    xp: 17,
    desc: 'Giống Na vùng Vườn.'
  },
  {
    id: 'la-1',
    icon: '🌿',
    name: 'Rau Muống Mini',
    type: 'la',
    seedPrice: 13,
    growTime: 43882,
    growStages: [30549, 33238, 37159, 43882],
    yield: 3,
    sellPrice: 9,
    xp: 3,
    desc: 'Rau Muống size Mini.'
  },
  {
    id: 'la-2',
    icon: '🌱',
    name: 'Rau Muống Nhỏ',
    type: 'la',
    seedPrice: 14,
    growTime: 47361,
    growStages: [30131, 34441, 46099, 47361],
    yield: 4,
    sellPrice: 10,
    xp: 4,
    desc: 'Rau Muống size Nhỏ.'
  },
  {
    id: 'la-3',
    icon: '🍃',
    name: 'Rau Muống Vừa',
    type: 'la',
    seedPrice: 15,
    growTime: 48933,
    growStages: [25750, 27425, 38961, 48933],
    yield: 5,
    sellPrice: 11,
    xp: 5,
    desc: 'Rau Muống size Vừa.'
  },
  {
    id: 'la-4',
    icon: '🟢',
    name: 'Rau Muống To',
    type: 'la',
    seedPrice: 16,
    growTime: 47965,
    growStages: [23974, 28600, 41603, 47965],
    yield: 6,
    sellPrice: 12,
    xp: 6,
    desc: 'Rau Muống size To.'
  },
  {
    id: 'la-5',
    icon: '🟣',
    name: 'Rau Muống Khổng Lồ',
    type: 'la',
    seedPrice: 17,
    growTime: 58473,
    growStages: [40301, 46084, 48475, 58473],
    yield: 2,
    sellPrice: 13,
    xp: 7,
    desc: 'Rau Muống size Khổng Lồ.'
  },
  {
    id: 'la-6',
    icon: '🥦',
    name: 'Rau Muống Lùn',
    type: 'la',
    seedPrice: 18,
    growTime: 53573,
    growStages: [43080, 43809, 46798, 53573],
    yield: 3,
    sellPrice: 14,
    xp: 8,
    desc: 'Rau Muống size Lùn.'
  },
  {
    id: 'la-7',
    icon: '🥒',
    name: 'Rau Muống Cao',
    type: 'la',
    seedPrice: 19,
    growTime: 44515,
    growStages: [16154, 18009, 31410, 44515],
    yield: 4,
    sellPrice: 15,
    xp: 9,
    desc: 'Rau Muống size Cao.'
  },
  {
    id: 'la-8',
    icon: '🧅',
    name: 'Rau Muống Dài',
    type: 'la',
    seedPrice: 20,
    growTime: 37085,
    growStages: [17430, 19878, 20359, 37085],
    yield: 5,
    sellPrice: 16,
    xp: 2,
    desc: 'Rau Muống size Dài.'
  },
  {
    id: 'la-9',
    icon: '🧄',
    name: 'Rau Muống Tròn',
    type: 'la',
    seedPrice: 21,
    growTime: 6846,
    growStages: [2159, 4436, 5097, 6846],
    yield: 6,
    sellPrice: 17,
    xp: 3,
    desc: 'Rau Muống size Tròn.'
  },
  {
    id: 'la-10',
    icon: '🥬',
    name: 'Rau Muống Xoắn',
    type: 'la',
    seedPrice: 22,
    growTime: 73161,
    growStages: [38880, 45265, 55765, 73161],
    yield: 2,
    sellPrice: 18,
    xp: 4,
    desc: 'Rau Muống size Xoắn.'
  },
  {
    id: 'la-11',
    icon: '🌿',
    name: 'Cải Mini',
    type: 'la',
    seedPrice: 23,
    growTime: 52911,
    growStages: [22856, 27705, 33744, 52911],
    yield: 3,
    sellPrice: 19,
    xp: 5,
    desc: 'Cải size Mini.'
  },
  {
    id: 'la-12',
    icon: '🌱',
    name: 'Cải Nhỏ',
    type: 'la',
    seedPrice: 24,
    growTime: 50681,
    growStages: [35101, 35809, 49236, 50681],
    yield: 4,
    sellPrice: 20,
    xp: 6,
    desc: 'Cải size Nhỏ.'
  },
  {
    id: 'la-13',
    icon: '🍃',
    name: 'Cải Vừa',
    type: 'la',
    seedPrice: 25,
    growTime: 33314,
    growStages: [14129, 15129, 26681, 33314],
    yield: 5,
    sellPrice: 21,
    xp: 7,
    desc: 'Cải size Vừa.'
  },
  {
    id: 'la-14',
    icon: '🟢',
    name: 'Cải To',
    type: 'la',
    seedPrice: 26,
    growTime: 39694,
    growStages: [20391, 25021, 26048, 39694],
    yield: 6,
    sellPrice: 22,
    xp: 8,
    desc: 'Cải size To.'
  },
  {
    id: 'la-15',
    icon: '🟣',
    name: 'Cải Khổng Lồ',
    type: 'la',
    seedPrice: 27,
    growTime: 24603,
    growStages: [16296, 16956, 23456, 24603],
    yield: 2,
    sellPrice: 8,
    xp: 9,
    desc: 'Cải size Khổng Lồ.'
  },
  {
    id: 'la-16',
    icon: '🥦',
    name: 'Cải Lùn',
    type: 'la',
    seedPrice: 28,
    growTime: 36314,
    growStages: [19019, 19085, 24718, 36314],
    yield: 3,
    sellPrice: 9,
    xp: 2,
    desc: 'Cải size Lùn.'
  },
  {
    id: 'la-17',
    icon: '🥒',
    name: 'Cải Cao',
    type: 'la',
    seedPrice: 29,
    growTime: 42903,
    growStages: [25476, 28050, 37761, 42903],
    yield: 4,
    sellPrice: 10,
    xp: 3,
    desc: 'Cải size Cao.'
  },
  {
    id: 'la-18',
    icon: '🧅',
    name: 'Cải Dài',
    type: 'la',
    seedPrice: 30,
    growTime: 30730,
    growStages: [11463, 17176, 19478, 30730],
    yield: 5,
    sellPrice: 11,
    xp: 4,
    desc: 'Cải size Dài.'
  },
  {
    id: 'la-19',
    icon: '🧄',
    name: 'Cải Tròn',
    type: 'la',
    seedPrice: 31,
    growTime: 33762,
    growStages: [16560, 21151, 29172, 33762],
    yield: 6,
    sellPrice: 12,
    xp: 5,
    desc: 'Cải size Tròn.'
  },
  {
    id: 'la-20',
    icon: '🥬',
    name: 'Cải Xoắn',
    type: 'la',
    seedPrice: 32,
    growTime: 40105,
    growStages: [16259, 20453, 26456, 40105],
    yield: 2,
    sellPrice: 13,
    xp: 6,
    desc: 'Cải size Xoắn.'
  },
  {
    id: 'la-21',
    icon: '🌿',
    name: 'Xà Lách Mini',
    type: 'la',
    seedPrice: 33,
    growTime: 30073,
    growStages: [17596, 22291, 25630, 30073],
    yield: 3,
    sellPrice: 14,
    xp: 7,
    desc: 'Xà Lách size Mini.'
  },
  {
    id: 'la-22',
    icon: '🌱',
    name: 'Xà Lách Nhỏ',
    type: 'la',
    seedPrice: 34,
    growTime: 39457,
    growStages: [25838, 28841, 32378, 39457],
    yield: 4,
    sellPrice: 15,
    xp: 8,
    desc: 'Xà Lách size Nhỏ.'
  },
  {
    id: 'la-23',
    icon: '🍃',
    name: 'Xà Lách Vừa',
    type: 'la',
    seedPrice: 35,
    growTime: 41593,
    growStages: [26771, 32444, 39536, 41593],
    yield: 5,
    sellPrice: 16,
    xp: 9,
    desc: 'Xà Lách size Vừa.'
  },
  {
    id: 'la-24',
    icon: '🟢',
    name: 'Xà Lách To',
    type: 'la',
    seedPrice: 36,
    growTime: 29784,
    growStages: [10848, 13827, 22682, 29784],
    yield: 6,
    sellPrice: 17,
    xp: 2,
    desc: 'Xà Lách size To.'
  },
  {
    id: 'la-25',
    icon: '🟣',
    name: 'Xà Lách Khổng Lồ',
    type: 'la',
    seedPrice: 37,
    growTime: 34496,
    growStages: [393, 5267, 15721, 34496],
    yield: 2,
    sellPrice: 18,
    xp: 3,
    desc: 'Xà Lách size Khổng Lồ.'
  },
  {
    id: 'la-26',
    icon: '🥦',
    name: 'Xà Lách Lùn',
    type: 'la',
    seedPrice: 38,
    growTime: 52617,
    growStages: [22038, 26145, 31618, 52617],
    yield: 3,
    sellPrice: 19,
    xp: 4,
    desc: 'Xà Lách size Lùn.'
  },
  {
    id: 'la-27',
    icon: '🥒',
    name: 'Xà Lách Cao',
    type: 'la',
    seedPrice: 39,
    growTime: 30764,
    growStages: [10693, 13898, 22334, 30764],
    yield: 4,
    sellPrice: 20,
    xp: 5,
    desc: 'Xà Lách size Cao.'
  },
  {
    id: 'la-28',
    icon: '🧅',
    name: 'Xà Lách Dài',
    type: 'la',
    seedPrice: 40,
    growTime: 34500,
    growStages: [8261, 10675, 15236, 34500],
    yield: 5,
    sellPrice: 21,
    xp: 6,
    desc: 'Xà Lách size Dài.'
  },
  {
    id: 'la-29',
    icon: '🧄',
    name: 'Xà Lách Tròn',
    type: 'la',
    seedPrice: 41,
    growTime: 64815,
    growStages: [30141, 31266, 45191, 64815],
    yield: 6,
    sellPrice: 22,
    xp: 7,
    desc: 'Xà Lách size Tròn.'
  },
  {
    id: 'la-30',
    icon: '🥬',
    name: 'Xà Lách Xoắn',
    type: 'la',
    seedPrice: 42,
    growTime: 27683,
    growStages: [16727, 18009, 24860, 27683],
    yield: 2,
    sellPrice: 8,
    xp: 8,
    desc: 'Xà Lách size Xoắn.'
  },
  {
    id: 'la-31',
    icon: '🌿',
    name: 'Rau Dền Mini',
    type: 'la',
    seedPrice: 43,
    growTime: 65985,
    growStages: [37531, 41301, 48585, 65985],
    yield: 3,
    sellPrice: 9,
    xp: 9,
    desc: 'Rau Dền size Mini.'
  },
  {
    id: 'la-32',
    icon: '🌱',
    name: 'Rau Dền Nhỏ',
    type: 'la',
    seedPrice: 44,
    growTime: 17592,
    growStages: [9122, 11004, 13310, 17592],
    yield: 4,
    sellPrice: 10,
    xp: 2,
    desc: 'Rau Dền size Nhỏ.'
  },
  {
    id: 'la-33',
    icon: '🍃',
    name: 'Rau Dền Vừa',
    type: 'la',
    seedPrice: 45,
    growTime: 44483,
    growStages: [32491, 34428, 37642, 44483],
    yield: 5,
    sellPrice: 11,
    xp: 3,
    desc: 'Rau Dền size Vừa.'
  },
  {
    id: 'la-34',
    icon: '🟢',
    name: 'Rau Dền To',
    type: 'la',
    seedPrice: 46,
    growTime: 61583,
    growStages: [34531, 41178, 47268, 61583],
    yield: 6,
    sellPrice: 12,
    xp: 4,
    desc: 'Rau Dền size To.'
  },
  {
    id: 'la-35',
    icon: '🟣',
    name: 'Rau Dền Khổng Lồ',
    type: 'la',
    seedPrice: 47,
    growTime: 49404,
    growStages: [41202, 41990, 45617, 49404],
    yield: 2,
    sellPrice: 13,
    xp: 5,
    desc: 'Rau Dền size Khổng Lồ.'
  },
  {
    id: 'la-36',
    icon: '🥦',
    name: 'Rau Dền Lùn',
    type: 'la',
    seedPrice: 48,
    growTime: 45678,
    growStages: [25281, 30621, 35394, 45678],
    yield: 3,
    sellPrice: 14,
    xp: 6,
    desc: 'Rau Dền size Lùn.'
  },
  {
    id: 'la-37',
    icon: '🥒',
    name: 'Rau Dền Cao',
    type: 'la',
    seedPrice: 49,
    growTime: 57031,
    growStages: [24515, 31271, 40780, 57031],
    yield: 4,
    sellPrice: 15,
    xp: 7,
    desc: 'Rau Dền size Cao.'
  },
  {
    id: 'la-38',
    icon: '🧅',
    name: 'Rau Dền Dài',
    type: 'la',
    seedPrice: 50,
    growTime: 49014,
    growStages: [27133, 32927, 36631, 49014],
    yield: 5,
    sellPrice: 16,
    xp: 8,
    desc: 'Rau Dền size Dài.'
  },
  {
    id: 'la-39',
    icon: '🧄',
    name: 'Rau Dền Tròn',
    type: 'la',
    seedPrice: 51,
    growTime: 44691,
    growStages: [10754, 15665, 27378, 44691],
    yield: 6,
    sellPrice: 17,
    xp: 9,
    desc: 'Rau Dền size Tròn.'
  },
  {
    id: 'la-40',
    icon: '🥬',
    name: 'Rau Dền Xoắn',
    type: 'la',
    seedPrice: 12,
    growTime: 51383,
    growStages: [25660, 28596, 35305, 51383],
    yield: 2,
    sellPrice: 18,
    xp: 2,
    desc: 'Rau Dền size Xoắn.'
  },
  {
    id: 'la-41',
    icon: '🌿',
    name: 'Húng Mini',
    type: 'la',
    seedPrice: 13,
    growTime: 19716,
    growStages: [9388, 12825, 16693, 19716],
    yield: 3,
    sellPrice: 19,
    xp: 3,
    desc: 'Húng size Mini.'
  },
  {
    id: 'la-42',
    icon: '🌱',
    name: 'Húng Nhỏ',
    type: 'la',
    seedPrice: 14,
    growTime: 29451,
    growStages: [12507, 14491, 15589, 29451],
    yield: 4,
    sellPrice: 20,
    xp: 4,
    desc: 'Húng size Nhỏ.'
  },
  {
    id: 'la-43',
    icon: '🍃',
    name: 'Húng Vừa',
    type: 'la',
    seedPrice: 15,
    growTime: 73352,
    growStages: [37671, 42723, 55393, 73352],
    yield: 5,
    sellPrice: 21,
    xp: 5,
    desc: 'Húng size Vừa.'
  },
  {
    id: 'la-44',
    icon: '🟢',
    name: 'Húng To',
    type: 'la',
    seedPrice: 16,
    growTime: 50387,
    growStages: [37847, 44832, 45447, 50387],
    yield: 6,
    sellPrice: 22,
    xp: 6,
    desc: 'Húng size To.'
  },
  {
    id: 'la-45',
    icon: '🟣',
    name: 'Húng Khổng Lồ',
    type: 'la',
    seedPrice: 17,
    growTime: 43919,
    growStages: [13218, 15266, 24679, 43919],
    yield: 2,
    sellPrice: 8,
    xp: 7,
    desc: 'Húng size Khổng Lồ.'
  },
  {
    id: 'la-46',
    icon: '🥦',
    name: 'Húng Lùn',
    type: 'la',
    seedPrice: 18,
    growTime: 58330,
    growStages: [37604, 40385, 48015, 58330],
    yield: 3,
    sellPrice: 9,
    xp: 8,
    desc: 'Húng size Lùn.'
  },
  {
    id: 'la-47',
    icon: '🥒',
    name: 'Húng Cao',
    type: 'la',
    seedPrice: 19,
    growTime: 26404,
    growStages: [11899, 13335, 15462, 26404],
    yield: 4,
    sellPrice: 10,
    xp: 9,
    desc: 'Húng size Cao.'
  },
  {
    id: 'la-48',
    icon: '🧅',
    name: 'Húng Dài',
    type: 'la',
    seedPrice: 20,
    growTime: 39968,
    growStages: [13620, 13770, 22043, 39968],
    yield: 5,
    sellPrice: 11,
    xp: 2,
    desc: 'Húng size Dài.'
  },
  {
    id: 'la-49',
    icon: '🧄',
    name: 'Húng Tròn',
    type: 'la',
    seedPrice: 21,
    growTime: 21249,
    growStages: [5617, 7225, 19036, 21249],
    yield: 6,
    sellPrice: 12,
    xp: 3,
    desc: 'Húng size Tròn.'
  },
  {
    id: 'la-50',
    icon: '🥬',
    name: 'Húng Xoắn',
    type: 'la',
    seedPrice: 22,
    growTime: 33153,
    growStages: [16011, 18435, 30608, 33153],
    yield: 2,
    sellPrice: 13,
    xp: 4,
    desc: 'Húng size Xoắn.'
  },
  {
    id: 'la-51',
    icon: '🌿',
    name: 'Diếp Cá Mini',
    type: 'la',
    seedPrice: 23,
    growTime: 34285,
    growStages: [26051, 26162, 32437, 34285],
    yield: 3,
    sellPrice: 14,
    xp: 5,
    desc: 'Diếp Cá size Mini.'
  },
  {
    id: 'la-52',
    icon: '🌱',
    name: 'Diếp Cá Nhỏ',
    type: 'la',
    seedPrice: 24,
    growTime: 32454,
    growStages: [360, 3038, 16257, 32454],
    yield: 4,
    sellPrice: 15,
    xp: 6,
    desc: 'Diếp Cá size Nhỏ.'
  },
  {
    id: 'la-53',
    icon: '🍃',
    name: 'Diếp Cá Vừa',
    type: 'la',
    seedPrice: 25,
    growTime: 20462,
    growStages: [81, 1512, 7791, 20462],
    yield: 5,
    sellPrice: 16,
    xp: 7,
    desc: 'Diếp Cá size Vừa.'
  },
  {
    id: 'la-54',
    icon: '🟢',
    name: 'Diếp Cá To',
    type: 'la',
    seedPrice: 26,
    growTime: 41036,
    growStages: [14022, 15579, 20222, 41036],
    yield: 6,
    sellPrice: 17,
    xp: 8,
    desc: 'Diếp Cá size To.'
  },
  {
    id: 'la-55',
    icon: '🟣',
    name: 'Diếp Cá Khổng Lồ',
    type: 'la',
    seedPrice: 27,
    growTime: 35203,
    growStages: [26305, 28313, 28930, 35203],
    yield: 2,
    sellPrice: 18,
    xp: 9,
    desc: 'Diếp Cá size Khổng Lồ.'
  },
  {
    id: 'la-56',
    icon: '🥦',
    name: 'Diếp Cá Lùn',
    type: 'la',
    seedPrice: 28,
    growTime: 34448,
    growStages: [20728, 24361, 30005, 34448],
    yield: 3,
    sellPrice: 19,
    xp: 2,
    desc: 'Diếp Cá size Lùn.'
  },
  {
    id: 'la-57',
    icon: '🥒',
    name: 'Diếp Cá Cao',
    type: 'la',
    seedPrice: 29,
    growTime: 73930,
    growStages: [42462, 47937, 58349, 73930],
    yield: 4,
    sellPrice: 20,
    xp: 3,
    desc: 'Diếp Cá size Cao.'
  },
  {
    id: 'la-58',
    icon: '🧅',
    name: 'Diếp Cá Dài',
    type: 'la',
    seedPrice: 30,
    growTime: 24753,
    growStages: [7673, 11007, 19428, 24753],
    yield: 5,
    sellPrice: 21,
    xp: 4,
    desc: 'Diếp Cá size Dài.'
  },
  {
    id: 'la-59',
    icon: '🧄',
    name: 'Diếp Cá Tròn',
    type: 'la',
    seedPrice: 31,
    growTime: 68310,
    growStages: [40486, 42435, 53514, 68310],
    yield: 6,
    sellPrice: 22,
    xp: 5,
    desc: 'Diếp Cá size Tròn.'
  },
  {
    id: 'la-60',
    icon: '🥬',
    name: 'Diếp Cá Xoắn',
    type: 'la',
    seedPrice: 32,
    growTime: 13490,
    growStages: [4741, 7108, 10247, 13490],
    yield: 2,
    sellPrice: 8,
    xp: 6,
    desc: 'Diếp Cá size Xoắn.'
  },
  {
    id: 'la-61',
    icon: '🌿',
    name: 'Tía Tô Mini',
    type: 'la',
    seedPrice: 33,
    growTime: 51223,
    growStages: [15001, 18204, 32548, 51223],
    yield: 3,
    sellPrice: 9,
    xp: 7,
    desc: 'Tía Tô size Mini.'
  },
  {
    id: 'la-62',
    icon: '🌱',
    name: 'Tía Tô Nhỏ',
    type: 'la',
    seedPrice: 34,
    growTime: 38140,
    growStages: [15842, 18067, 26668, 38140],
    yield: 4,
    sellPrice: 10,
    xp: 8,
    desc: 'Tía Tô size Nhỏ.'
  },
  {
    id: 'la-63',
    icon: '🍃',
    name: 'Tía Tô Vừa',
    type: 'la',
    seedPrice: 35,
    growTime: 44619,
    growStages: [21363, 24741, 26629, 44619],
    yield: 5,
    sellPrice: 11,
    xp: 9,
    desc: 'Tía Tô size Vừa.'
  },
  {
    id: 'la-64',
    icon: '🟢',
    name: 'Tía Tô To',
    type: 'la',
    seedPrice: 36,
    growTime: 47131,
    growStages: [25203, 30033, 34962, 47131],
    yield: 6,
    sellPrice: 12,
    xp: 2,
    desc: 'Tía Tô size To.'
  },
  {
    id: 'la-65',
    icon: '🟣',
    name: 'Tía Tô Khổng Lồ',
    type: 'la',
    seedPrice: 37,
    growTime: 41035,
    growStages: [4139, 8390, 21001, 41035],
    yield: 2,
    sellPrice: 13,
    xp: 3,
    desc: 'Tía Tô size Khổng Lồ.'
  },
  {
    id: 'la-66',
    icon: '🥦',
    name: 'Tía Tô Lùn',
    type: 'la',
    seedPrice: 38,
    growTime: 41356,
    growStages: [25344, 29259, 32377, 41356],
    yield: 3,
    sellPrice: 14,
    xp: 4,
    desc: 'Tía Tô size Lùn.'
  },
  {
    id: 'la-67',
    icon: '🥒',
    name: 'Tía Tô Cao',
    type: 'la',
    seedPrice: 39,
    growTime: 47281,
    growStages: [30656, 32771, 43028, 47281],
    yield: 4,
    sellPrice: 15,
    xp: 5,
    desc: 'Tía Tô size Cao.'
  },
  {
    id: 'la-68',
    icon: '🧅',
    name: 'Tía Tô Dài',
    type: 'la',
    seedPrice: 40,
    growTime: 32029,
    growStages: [9426, 10082, 17029, 32029],
    yield: 5,
    sellPrice: 16,
    xp: 6,
    desc: 'Tía Tô size Dài.'
  },
  {
    id: 'la-69',
    icon: '🧄',
    name: 'Tía Tô Tròn',
    type: 'la',
    seedPrice: 41,
    growTime: 54048,
    growStages: [37816, 38675, 42985, 54048],
    yield: 6,
    sellPrice: 17,
    xp: 7,
    desc: 'Tía Tô size Tròn.'
  },
  {
    id: 'la-70',
    icon: '🥬',
    name: 'Tía Tô Xoắn',
    type: 'la',
    seedPrice: 42,
    growTime: 24514,
    growStages: [7943, 8426, 21566, 24514],
    yield: 2,
    sellPrice: 18,
    xp: 8,
    desc: 'Tía Tô size Xoắn.'
  },
  {
    id: 'la-71',
    icon: '🌿',
    name: 'Kinh Giới Mini',
    type: 'la',
    seedPrice: 43,
    growTime: 49589,
    growStages: [24563, 31485, 45574, 49589],
    yield: 3,
    sellPrice: 19,
    xp: 9,
    desc: 'Kinh Giới size Mini.'
  },
  {
    id: 'la-72',
    icon: '🌱',
    name: 'Kinh Giới Nhỏ',
    type: 'la',
    seedPrice: 44,
    growTime: 50430,
    growStages: [38161, 38288, 43899, 50430],
    yield: 4,
    sellPrice: 20,
    xp: 2,
    desc: 'Kinh Giới size Nhỏ.'
  },
  {
    id: 'la-73',
    icon: '🍃',
    name: 'Kinh Giới Vừa',
    type: 'la',
    seedPrice: 45,
    growTime: 30671,
    growStages: [23503, 28118, 28741, 30671],
    yield: 5,
    sellPrice: 21,
    xp: 3,
    desc: 'Kinh Giới size Vừa.'
  },
  {
    id: 'la-74',
    icon: '🟢',
    name: 'Kinh Giới To',
    type: 'la',
    seedPrice: 46,
    growTime: 35907,
    growStages: [18056, 22912, 24036, 35907],
    yield: 6,
    sellPrice: 22,
    xp: 4,
    desc: 'Kinh Giới size To.'
  },
  {
    id: 'la-75',
    icon: '🟣',
    name: 'Kinh Giới Khổng Lồ',
    type: 'la',
    seedPrice: 47,
    growTime: 25879,
    growStages: [410, 4839, 16240, 25879],
    yield: 2,
    sellPrice: 8,
    xp: 5,
    desc: 'Kinh Giới size Khổng Lồ.'
  },
  {
    id: 'la-76',
    icon: '🥦',
    name: 'Kinh Giới Lùn',
    type: 'la',
    seedPrice: 48,
    growTime: 26922,
    growStages: [1231, 7858, 14145, 26922],
    yield: 3,
    sellPrice: 9,
    xp: 6,
    desc: 'Kinh Giới size Lùn.'
  },
  {
    id: 'la-77',
    icon: '🥒',
    name: 'Kinh Giới Cao',
    type: 'la',
    seedPrice: 49,
    growTime: 44614,
    growStages: [7389, 14257, 24409, 44614],
    yield: 4,
    sellPrice: 10,
    xp: 7,
    desc: 'Kinh Giới size Cao.'
  },
  {
    id: 'la-78',
    icon: '🧅',
    name: 'Kinh Giới Dài',
    type: 'la',
    seedPrice: 50,
    growTime: 28357,
    growStages: [6884, 7395, 7839, 28357],
    yield: 5,
    sellPrice: 11,
    xp: 8,
    desc: 'Kinh Giới size Dài.'
  },
  {
    id: 'la-79',
    icon: '🧄',
    name: 'Kinh Giới Tròn',
    type: 'la',
    seedPrice: 51,
    growTime: 52881,
    growStages: [31824, 36474, 42364, 52881],
    yield: 6,
    sellPrice: 12,
    xp: 9,
    desc: 'Kinh Giới size Tròn.'
  },
  {
    id: 'la-80',
    icon: '🥬',
    name: 'Kinh Giới Xoắn',
    type: 'la',
    seedPrice: 12,
    growTime: 46731,
    growStages: [17175, 17716, 29664, 46731],
    yield: 2,
    sellPrice: 13,
    xp: 2,
    desc: 'Kinh Giới size Xoắn.'
  },
  {
    id: 'la-81',
    icon: '🌿',
    name: 'Bạc Hà Mini',
    type: 'la',
    seedPrice: 13,
    growTime: 56992,
    growStages: [29831, 36783, 48159, 56992],
    yield: 3,
    sellPrice: 14,
    xp: 3,
    desc: 'Bạc Hà size Mini.'
  },
  {
    id: 'la-82',
    icon: '🌱',
    name: 'Bạc Hà Nhỏ',
    type: 'la',
    seedPrice: 14,
    growTime: 68054,
    growStages: [37325, 38088, 52083, 68054],
    yield: 4,
    sellPrice: 15,
    xp: 4,
    desc: 'Bạc Hà size Nhỏ.'
  },
  {
    id: 'la-83',
    icon: '🍃',
    name: 'Bạc Hà Vừa',
    type: 'la',
    seedPrice: 15,
    growTime: 35686,
    growStages: [9274, 15779, 18166, 35686],
    yield: 5,
    sellPrice: 16,
    xp: 5,
    desc: 'Bạc Hà size Vừa.'
  },
  {
    id: 'la-84',
    icon: '🟢',
    name: 'Bạc Hà To',
    type: 'la',
    seedPrice: 16,
    growTime: 35781,
    growStages: [2607, 2815, 14747, 35781],
    yield: 6,
    sellPrice: 17,
    xp: 6,
    desc: 'Bạc Hà size To.'
  },
  {
    id: 'la-85',
    icon: '🟣',
    name: 'Bạc Hà Khổng Lồ',
    type: 'la',
    seedPrice: 17,
    growTime: 60118,
    growStages: [38469, 39072, 47647, 60118],
    yield: 2,
    sellPrice: 18,
    xp: 7,
    desc: 'Bạc Hà size Khổng Lồ.'
  },
  {
    id: 'la-86',
    icon: '🥦',
    name: 'Bạc Hà Lùn',
    type: 'la',
    seedPrice: 18,
    growTime: 48625,
    growStages: [25566, 26855, 38241, 48625],
    yield: 3,
    sellPrice: 19,
    xp: 8,
    desc: 'Bạc Hà size Lùn.'
  },
  {
    id: 'la-87',
    icon: '🥒',
    name: 'Bạc Hà Cao',
    type: 'la',
    seedPrice: 19,
    growTime: 33912,
    growStages: [16118, 17727, 31577, 33912],
    yield: 4,
    sellPrice: 20,
    xp: 9,
    desc: 'Bạc Hà size Cao.'
  },
  {
    id: 'la-88',
    icon: '🧅',
    name: 'Bạc Hà Dài',
    type: 'la',
    seedPrice: 20,
    growTime: 39000,
    growStages: [7706, 12788, 21959, 39000],
    yield: 5,
    sellPrice: 21,
    xp: 2,
    desc: 'Bạc Hà size Dài.'
  },
  {
    id: 'la-89',
    icon: '🧄',
    name: 'Bạc Hà Tròn',
    type: 'la',
    seedPrice: 21,
    growTime: 38848,
    growStages: [9167, 13257, 26549, 38848],
    yield: 6,
    sellPrice: 22,
    xp: 3,
    desc: 'Bạc Hà size Tròn.'
  },
  {
    id: 'la-90',
    icon: '🥬',
    name: 'Bạc Hà Xoắn',
    type: 'la',
    seedPrice: 22,
    growTime: 26330,
    growStages: [970, 7078, 8857, 26330],
    yield: 2,
    sellPrice: 8,
    xp: 4,
    desc: 'Bạc Hà size Xoắn.'
  },
  {
    id: 'la-91',
    icon: '🌿',
    name: 'Ngò Mini',
    type: 'la',
    seedPrice: 23,
    growTime: 28839,
    growStages: [6474, 9642, 17431, 28839],
    yield: 3,
    sellPrice: 9,
    xp: 5,
    desc: 'Ngò size Mini.'
  },
  {
    id: 'la-92',
    icon: '🌱',
    name: 'Ngò Nhỏ',
    type: 'la',
    seedPrice: 24,
    growTime: 31446,
    growStages: [4722, 6132, 16616, 31446],
    yield: 4,
    sellPrice: 10,
    xp: 6,
    desc: 'Ngò size Nhỏ.'
  },
  {
    id: 'la-93',
    icon: '🍃',
    name: 'Ngò Vừa',
    type: 'la',
    seedPrice: 25,
    growTime: 33901,
    growStages: [10567, 13301, 21121, 33901],
    yield: 5,
    sellPrice: 11,
    xp: 7,
    desc: 'Ngò size Vừa.'
  },
  {
    id: 'la-94',
    icon: '🟢',
    name: 'Ngò To',
    type: 'la',
    seedPrice: 26,
    growTime: 59640,
    growStages: [32144, 37203, 40462, 59640],
    yield: 6,
    sellPrice: 12,
    xp: 8,
    desc: 'Ngò size To.'
  },
  {
    id: 'la-95',
    icon: '🟣',
    name: 'Ngò Khổng Lồ',
    type: 'la',
    seedPrice: 27,
    growTime: 67525,
    growStages: [36823, 40962, 53266, 67525],
    yield: 2,
    sellPrice: 13,
    xp: 9,
    desc: 'Ngò size Khổng Lồ.'
  },
  {
    id: 'la-96',
    icon: '🥦',
    name: 'Ngò Lùn',
    type: 'la',
    seedPrice: 28,
    growTime: 45500,
    growStages: [28288, 30168, 35864, 45500],
    yield: 3,
    sellPrice: 14,
    xp: 2,
    desc: 'Ngò size Lùn.'
  },
  {
    id: 'la-97',
    icon: '🥒',
    name: 'Ngò Cao',
    type: 'la',
    seedPrice: 29,
    growTime: 69337,
    growStages: [34521, 41510, 47740, 69337],
    yield: 4,
    sellPrice: 15,
    xp: 3,
    desc: 'Ngò size Cao.'
  },
  {
    id: 'la-98',
    icon: '🧅',
    name: 'Ngò Dài',
    type: 'la',
    seedPrice: 30,
    growTime: 40629,
    growStages: [23593, 30262, 32371, 40629],
    yield: 5,
    sellPrice: 16,
    xp: 4,
    desc: 'Ngò size Dài.'
  },
  {
    id: 'la-99',
    icon: '🧄',
    name: 'Ngò Tròn',
    type: 'la',
    seedPrice: 31,
    growTime: 75244,
    growStages: [40121, 46930, 56029, 75244],
    yield: 6,
    sellPrice: 17,
    xp: 5,
    desc: 'Ngò size Tròn.'
  },
  {
    id: 'la-100',
    icon: '🥬',
    name: 'Ngò Xoắn',
    type: 'la',
    seedPrice: 32,
    growTime: 25740,
    growStages: [12198, 13570, 17542, 25740],
    yield: 2,
    sellPrice: 18,
    xp: 6,
    desc: 'Ngò size Xoắn.'
  },
  {
    id: 'la-101',
    icon: '🌿',
    name: 'Đinh Lăng Mini',
    type: 'la',
    seedPrice: 33,
    growTime: 46653,
    growStages: [34757, 36664, 42913, 46653],
    yield: 3,
    sellPrice: 19,
    xp: 7,
    desc: 'Đinh Lăng size Mini.'
  },
  {
    id: 'la-102',
    icon: '🌱',
    name: 'Đinh Lăng Nhỏ',
    type: 'la',
    seedPrice: 34,
    growTime: 68759,
    growStages: [42819, 43843, 55051, 68759],
    yield: 4,
    sellPrice: 20,
    xp: 8,
    desc: 'Đinh Lăng size Nhỏ.'
  },
  {
    id: 'la-103',
    icon: '🍃',
    name: 'Đinh Lăng Vừa',
    type: 'la',
    seedPrice: 35,
    growTime: 36858,
    growStages: [5208, 10307, 18435, 36858],
    yield: 5,
    sellPrice: 21,
    xp: 9,
    desc: 'Đinh Lăng size Vừa.'
  },
  {
    id: 'la-104',
    icon: '🟢',
    name: 'Đinh Lăng To',
    type: 'la',
    seedPrice: 36,
    growTime: 53030,
    growStages: [38067, 44017, 48081, 53030],
    yield: 6,
    sellPrice: 22,
    xp: 2,
    desc: 'Đinh Lăng size To.'
  },
  {
    id: 'la-105',
    icon: '🟣',
    name: 'Đinh Lăng Khổng Lồ',
    type: 'la',
    seedPrice: 37,
    growTime: 33641,
    growStages: [18058, 23340, 23619, 33641],
    yield: 2,
    sellPrice: 8,
    xp: 3,
    desc: 'Đinh Lăng size Khổng Lồ.'
  },
  {
    id: 'la-106',
    icon: '🥦',
    name: 'Đinh Lăng Lùn',
    type: 'la',
    seedPrice: 38,
    growTime: 39286,
    growStages: [1878, 7483, 21118, 39286],
    yield: 3,
    sellPrice: 9,
    xp: 4,
    desc: 'Đinh Lăng size Lùn.'
  },
  {
    id: 'la-107',
    icon: '🥒',
    name: 'Đinh Lăng Cao',
    type: 'la',
    seedPrice: 39,
    growTime: 55238,
    growStages: [34861, 40647, 54764, 55238],
    yield: 4,
    sellPrice: 10,
    xp: 5,
    desc: 'Đinh Lăng size Cao.'
  },
  {
    id: 'la-108',
    icon: '🧅',
    name: 'Đinh Lăng Dài',
    type: 'la',
    seedPrice: 40,
    growTime: 64962,
    growStages: [36498, 41128, 46518, 64962],
    yield: 5,
    sellPrice: 11,
    xp: 6,
    desc: 'Đinh Lăng size Dài.'
  },
  {
    id: 'la-109',
    icon: '🧄',
    name: 'Đinh Lăng Tròn',
    type: 'la',
    seedPrice: 41,
    growTime: 49387,
    growStages: [25921, 28519, 33841, 49387],
    yield: 6,
    sellPrice: 12,
    xp: 7,
    desc: 'Đinh Lăng size Tròn.'
  },
  {
    id: 'la-110',
    icon: '🥬',
    name: 'Đinh Lăng Xoắn',
    type: 'la',
    seedPrice: 42,
    growTime: 32255,
    growStages: [19858, 20215, 23193, 32255],
    yield: 2,
    sellPrice: 13,
    xp: 8,
    desc: 'Đinh Lăng size Xoắn.'
  },
  {
    id: 'la-111',
    icon: '🌿',
    name: 'Lá Lốt Mini',
    type: 'la',
    seedPrice: 43,
    growTime: 53478,
    growStages: [32057, 33410, 46900, 53478],
    yield: 3,
    sellPrice: 14,
    xp: 9,
    desc: 'Lá Lốt size Mini.'
  },
  {
    id: 'la-112',
    icon: '🌱',
    name: 'Lá Lốt Nhỏ',
    type: 'la',
    seedPrice: 44,
    growTime: 15486,
    growStages: [2074, 2201, 3538, 15486],
    yield: 4,
    sellPrice: 15,
    xp: 2,
    desc: 'Lá Lốt size Nhỏ.'
  },
  {
    id: 'la-113',
    icon: '🍃',
    name: 'Lá Lốt Vừa',
    type: 'la',
    seedPrice: 45,
    growTime: 48526,
    growStages: [26906, 28046, 31812, 48526],
    yield: 5,
    sellPrice: 16,
    xp: 3,
    desc: 'Lá Lốt size Vừa.'
  },
  {
    id: 'la-114',
    icon: '🟢',
    name: 'Lá Lốt To',
    type: 'la',
    seedPrice: 46,
    growTime: 41443,
    growStages: [27854, 32159, 34195, 41443],
    yield: 6,
    sellPrice: 17,
    xp: 4,
    desc: 'Lá Lốt size To.'
  },
  {
    id: 'la-115',
    icon: '🟣',
    name: 'Lá Lốt Khổng Lồ',
    type: 'la',
    seedPrice: 47,
    growTime: 36278,
    growStages: [7315, 8083, 19388, 36278],
    yield: 2,
    sellPrice: 18,
    xp: 5,
    desc: 'Lá Lốt size Khổng Lồ.'
  },
  {
    id: 'la-116',
    icon: '🥦',
    name: 'Lá Lốt Lùn',
    type: 'la',
    seedPrice: 48,
    growTime: 52443,
    growStages: [14974, 20770, 34938, 52443],
    yield: 3,
    sellPrice: 19,
    xp: 6,
    desc: 'Lá Lốt size Lùn.'
  },
  {
    id: 'la-117',
    icon: '🥒',
    name: 'Lá Lốt Cao',
    type: 'la',
    seedPrice: 49,
    growTime: 48008,
    growStages: [22306, 24347, 32729, 48008],
    yield: 4,
    sellPrice: 20,
    xp: 7,
    desc: 'Lá Lốt size Cao.'
  },
  {
    id: 'la-118',
    icon: '🧅',
    name: 'Lá Lốt Dài',
    type: 'la',
    seedPrice: 50,
    growTime: 66085,
    growStages: [28998, 34270, 47272, 66085],
    yield: 5,
    sellPrice: 21,
    xp: 8,
    desc: 'Lá Lốt size Dài.'
  },
  {
    id: 'la-119',
    icon: '🧄',
    name: 'Lá Lốt Tròn',
    type: 'la',
    seedPrice: 51,
    growTime: 47438,
    growStages: [32026, 32509, 42454, 47438],
    yield: 6,
    sellPrice: 22,
    xp: 9,
    desc: 'Lá Lốt size Tròn.'
  },
  {
    id: 'la-120',
    icon: '🥬',
    name: 'Lá Lốt Xoắn',
    type: 'la',
    seedPrice: 12,
    growTime: 31833,
    growStages: [10164, 14512, 23044, 31833],
    yield: 2,
    sellPrice: 8,
    xp: 2,
    desc: 'Lá Lốt size Xoắn.'
  },
  {
    id: 'la-121',
    icon: '🌿',
    name: 'Rau Má Mini',
    type: 'la',
    seedPrice: 13,
    growTime: 49394,
    growStages: [16424, 19357, 29298, 49394],
    yield: 3,
    sellPrice: 9,
    xp: 3,
    desc: 'Rau Má size Mini.'
  },
  {
    id: 'la-122',
    icon: '🌱',
    name: 'Rau Má Nhỏ',
    type: 'la',
    seedPrice: 14,
    growTime: 42949,
    growStages: [32885, 39089, 41292, 42949],
    yield: 4,
    sellPrice: 10,
    xp: 4,
    desc: 'Rau Má size Nhỏ.'
  },
  {
    id: 'la-123',
    icon: '🍃',
    name: 'Rau Má Vừa',
    type: 'la',
    seedPrice: 15,
    growTime: 29172,
    growStages: [3265, 8119, 13450, 29172],
    yield: 5,
    sellPrice: 11,
    xp: 5,
    desc: 'Rau Má size Vừa.'
  },
  {
    id: 'la-124',
    icon: '🟢',
    name: 'Rau Má To',
    type: 'la',
    seedPrice: 16,
    growTime: 58884,
    growStages: [40866, 41523, 54638, 58884],
    yield: 6,
    sellPrice: 12,
    xp: 6,
    desc: 'Rau Má size To.'
  },
  {
    id: 'la-125',
    icon: '🟣',
    name: 'Rau Má Khổng Lồ',
    type: 'la',
    seedPrice: 17,
    growTime: 47764,
    growStages: [32859, 36032, 40596, 47764],
    yield: 2,
    sellPrice: 13,
    xp: 7,
    desc: 'Rau Má size Khổng Lồ.'
  },
  {
    id: 'la-126',
    icon: '🥦',
    name: 'Rau Má Lùn',
    type: 'la',
    seedPrice: 18,
    growTime: 31530,
    growStages: [7879, 11046, 22156, 31530],
    yield: 3,
    sellPrice: 14,
    xp: 8,
    desc: 'Rau Má size Lùn.'
  },
  {
    id: 'la-127',
    icon: '🥒',
    name: 'Rau Má Cao',
    type: 'la',
    seedPrice: 19,
    growTime: 70999,
    growStages: [42578, 49655, 63207, 70999],
    yield: 4,
    sellPrice: 15,
    xp: 9,
    desc: 'Rau Má size Cao.'
  },
  {
    id: 'la-128',
    icon: '🧅',
    name: 'Rau Má Dài',
    type: 'la',
    seedPrice: 20,
    growTime: 42572,
    growStages: [16410, 19961, 23606, 42572],
    yield: 5,
    sellPrice: 16,
    xp: 2,
    desc: 'Rau Má size Dài.'
  },
  {
    id: 'la-129',
    icon: '🧄',
    name: 'Rau Má Tròn',
    type: 'la',
    seedPrice: 21,
    growTime: 47644,
    growStages: [18820, 24802, 31845, 47644],
    yield: 6,
    sellPrice: 17,
    xp: 3,
    desc: 'Rau Má size Tròn.'
  },
  {
    id: 'la-130',
    icon: '🥬',
    name: 'Rau Má Xoắn',
    type: 'la',
    seedPrice: 22,
    growTime: 45929,
    growStages: [25323, 28290, 38826, 45929],
    yield: 2,
    sellPrice: 18,
    xp: 4,
    desc: 'Rau Má size Xoắn.'
  },
  {
    id: 'la-131',
    icon: '🌿',
    name: 'Cần Tây Mini',
    type: 'la',
    seedPrice: 23,
    growTime: 17306,
    growStages: [7703, 11860, 15068, 17306],
    yield: 3,
    sellPrice: 19,
    xp: 5,
    desc: 'Cần Tây size Mini.'
  },
  {
    id: 'la-132',
    icon: '🌱',
    name: 'Cần Tây Nhỏ',
    type: 'la',
    seedPrice: 24,
    growTime: 61418,
    growStages: [40290, 43121, 50018, 61418],
    yield: 4,
    sellPrice: 20,
    xp: 6,
    desc: 'Cần Tây size Nhỏ.'
  },
  {
    id: 'la-133',
    icon: '🍃',
    name: 'Cần Tây Vừa',
    type: 'la',
    seedPrice: 25,
    growTime: 46625,
    growStages: [33427, 37632, 44926, 46625],
    yield: 5,
    sellPrice: 21,
    xp: 7,
    desc: 'Cần Tây size Vừa.'
  },
  {
    id: 'la-134',
    icon: '🟢',
    name: 'Cần Tây To',
    type: 'la',
    seedPrice: 26,
    growTime: 14500,
    growStages: [3330, 5270, 7352, 14500],
    yield: 6,
    sellPrice: 22,
    xp: 8,
    desc: 'Cần Tây size To.'
  },
  {
    id: 'la-135',
    icon: '🟣',
    name: 'Cần Tây Khổng Lồ',
    type: 'la',
    seedPrice: 27,
    growTime: 38784,
    growStages: [12199, 17510, 23078, 38784],
    yield: 2,
    sellPrice: 8,
    xp: 9,
    desc: 'Cần Tây size Khổng Lồ.'
  },
  {
    id: 'la-136',
    icon: '🥦',
    name: 'Cần Tây Lùn',
    type: 'la',
    seedPrice: 28,
    growTime: 42295,
    growStages: [21009, 22007, 30867, 42295],
    yield: 3,
    sellPrice: 9,
    xp: 2,
    desc: 'Cần Tây size Lùn.'
  },
  {
    id: 'la-137',
    icon: '🥒',
    name: 'Cần Tây Cao',
    type: 'la',
    seedPrice: 29,
    growTime: 41926,
    growStages: [25148, 29680, 33795, 41926],
    yield: 4,
    sellPrice: 10,
    xp: 3,
    desc: 'Cần Tây size Cao.'
  },
  {
    id: 'la-138',
    icon: '🧅',
    name: 'Cần Tây Dài',
    type: 'la',
    seedPrice: 30,
    growTime: 34775,
    growStages: [15216, 17639, 21899, 34775],
    yield: 5,
    sellPrice: 11,
    xp: 4,
    desc: 'Cần Tây size Dài.'
  },
  {
    id: 'la-139',
    icon: '🧄',
    name: 'Cần Tây Tròn',
    type: 'la',
    seedPrice: 31,
    growTime: 53889,
    growStages: [30181, 33711, 40154, 53889],
    yield: 6,
    sellPrice: 12,
    xp: 5,
    desc: 'Cần Tây size Tròn.'
  },
  {
    id: 'la-140',
    icon: '🥬',
    name: 'Cần Tây Xoắn',
    type: 'la',
    seedPrice: 32,
    growTime: 53866,
    growStages: [21480, 26158, 38183, 53866],
    yield: 2,
    sellPrice: 13,
    xp: 6,
    desc: 'Cần Tây size Xoắn.'
  },
  {
    id: 'la-141',
    icon: '🌿',
    name: 'Bí Mini',
    type: 'la',
    seedPrice: 33,
    growTime: 27719,
    growStages: [11885, 13654, 23309, 27719],
    yield: 3,
    sellPrice: 14,
    xp: 7,
    desc: 'Bí size Mini.'
  },
  {
    id: 'la-142',
    icon: '🌱',
    name: 'Bí Nhỏ',
    type: 'la',
    seedPrice: 34,
    growTime: 71157,
    growStages: [42740, 46020, 57581, 71157],
    yield: 4,
    sellPrice: 15,
    xp: 8,
    desc: 'Bí size Nhỏ.'
  },
  {
    id: 'la-143',
    icon: '🍃',
    name: 'Bí Vừa',
    type: 'la',
    seedPrice: 35,
    growTime: 54378,
    growStages: [37990, 40167, 43710, 54378],
    yield: 5,
    sellPrice: 16,
    xp: 9,
    desc: 'Bí size Vừa.'
  },
  {
    id: 'la-144',
    icon: '🟢',
    name: 'Bí To',
    type: 'la',
    seedPrice: 36,
    growTime: 35441,
    growStages: [12831, 13496, 14144, 35441],
    yield: 6,
    sellPrice: 17,
    xp: 2,
    desc: 'Bí size To.'
  },
  {
    id: 'la-145',
    icon: '🟣',
    name: 'Bí Khổng Lồ',
    type: 'la',
    seedPrice: 37,
    growTime: 26963,
    growStages: [3912, 6766, 10385, 26963],
    yield: 2,
    sellPrice: 18,
    xp: 3,
    desc: 'Bí size Khổng Lồ.'
  },
  {
    id: 'la-146',
    icon: '🥦',
    name: 'Bí Lùn',
    type: 'la',
    seedPrice: 38,
    growTime: 60075,
    growStages: [35969, 41872, 54601, 60075],
    yield: 3,
    sellPrice: 19,
    xp: 4,
    desc: 'Bí size Lùn.'
  },
  {
    id: 'la-147',
    icon: '🥒',
    name: 'Bí Cao',
    type: 'la',
    seedPrice: 39,
    growTime: 25809,
    growStages: [4048, 9995, 18983, 25809],
    yield: 4,
    sellPrice: 20,
    xp: 5,
    desc: 'Bí size Cao.'
  },
  {
    id: 'la-148',
    icon: '🧅',
    name: 'Bí Dài',
    type: 'la',
    seedPrice: 40,
    growTime: 37468,
    growStages: [22211, 28544, 33844, 37468],
    yield: 5,
    sellPrice: 21,
    xp: 6,
    desc: 'Bí size Dài.'
  },
  {
    id: 'la-149',
    icon: '🧄',
    name: 'Bí Tròn',
    type: 'la',
    seedPrice: 41,
    growTime: 39111,
    growStages: [19868, 24470, 34302, 39111],
    yield: 6,
    sellPrice: 22,
    xp: 7,
    desc: 'Bí size Tròn.'
  },
  {
    id: 'la-150',
    icon: '🥬',
    name: 'Bí Xoắn',
    type: 'la',
    seedPrice: 42,
    growTime: 59406,
    growStages: [37879, 38703, 51487, 59406],
    yield: 2,
    sellPrice: 8,
    xp: 8,
    desc: 'Bí size Xoắn.'
  },
  {
    id: 'la-151',
    icon: '🌿',
    name: 'Mướp Mini',
    type: 'la',
    seedPrice: 43,
    growTime: 36705,
    growStages: [21799, 23199, 27740, 36705],
    yield: 3,
    sellPrice: 9,
    xp: 9,
    desc: 'Mướp size Mini.'
  },
  {
    id: 'la-152',
    icon: '🌱',
    name: 'Mướp Nhỏ',
    type: 'la',
    seedPrice: 44,
    growTime: 42956,
    growStages: [13377, 18461, 21756, 42956],
    yield: 4,
    sellPrice: 10,
    xp: 2,
    desc: 'Mướp size Nhỏ.'
  },
  {
    id: 'la-153',
    icon: '🍃',
    name: 'Mướp Vừa',
    type: 'la',
    seedPrice: 45,
    growTime: 37900,
    growStages: [14301, 18122, 30405, 37900],
    yield: 5,
    sellPrice: 11,
    xp: 3,
    desc: 'Mướp size Vừa.'
  },
  {
    id: 'la-154',
    icon: '🟢',
    name: 'Mướp To',
    type: 'la',
    seedPrice: 46,
    growTime: 67711,
    growStages: [37903, 43000, 47355, 67711],
    yield: 6,
    sellPrice: 12,
    xp: 4,
    desc: 'Mướp size To.'
  },
  {
    id: 'la-155',
    icon: '🟣',
    name: 'Mướp Khổng Lồ',
    type: 'la',
    seedPrice: 47,
    growTime: 45768,
    growStages: [11012, 15126, 24496, 45768],
    yield: 2,
    sellPrice: 13,
    xp: 5,
    desc: 'Mướp size Khổng Lồ.'
  },
  {
    id: 'la-156',
    icon: '🥦',
    name: 'Mướp Lùn',
    type: 'la',
    seedPrice: 48,
    growTime: 73945,
    growStages: [42217, 45608, 58507, 73945],
    yield: 3,
    sellPrice: 14,
    xp: 6,
    desc: 'Mướp size Lùn.'
  },
  {
    id: 'la-157',
    icon: '🥒',
    name: 'Mướp Cao',
    type: 'la',
    seedPrice: 49,
    growTime: 43954,
    growStages: [35145, 35460, 39980, 43954],
    yield: 4,
    sellPrice: 15,
    xp: 7,
    desc: 'Mướp size Cao.'
  },
  {
    id: 'la-158',
    icon: '🧅',
    name: 'Mướp Dài',
    type: 'la',
    seedPrice: 50,
    growTime: 35069,
    growStages: [3479, 6958, 13486, 35069],
    yield: 5,
    sellPrice: 16,
    xp: 8,
    desc: 'Mướp size Dài.'
  },
  {
    id: 'la-159',
    icon: '🧄',
    name: 'Mướp Tròn',
    type: 'la',
    seedPrice: 51,
    growTime: 48277,
    growStages: [21299, 26742, 35125, 48277],
    yield: 6,
    sellPrice: 17,
    xp: 9,
    desc: 'Mướp size Tròn.'
  },
  {
    id: 'la-160',
    icon: '🥬',
    name: 'Mướp Xoắn',
    type: 'la',
    seedPrice: 12,
    growTime: 34781,
    growStages: [19470, 20118, 23006, 34781],
    yield: 2,
    sellPrice: 18,
    xp: 2,
    desc: 'Mướp size Xoắn.'
  },
  {
    id: 'la-161',
    icon: '🌿',
    name: 'Đậu Mini',
    type: 'la',
    seedPrice: 13,
    growTime: 41845,
    growStages: [3670, 9829, 21731, 41845],
    yield: 3,
    sellPrice: 19,
    xp: 3,
    desc: 'Đậu size Mini.'
  },
  {
    id: 'la-162',
    icon: '🌱',
    name: 'Đậu Nhỏ',
    type: 'la',
    seedPrice: 14,
    growTime: 40490,
    growStages: [23871, 30614, 38890, 40490],
    yield: 4,
    sellPrice: 20,
    xp: 4,
    desc: 'Đậu size Nhỏ.'
  },
  {
    id: 'la-163',
    icon: '🍃',
    name: 'Đậu Vừa',
    type: 'la',
    seedPrice: 15,
    growTime: 29292,
    growStages: [18604, 22049, 23017, 29292],
    yield: 5,
    sellPrice: 21,
    xp: 5,
    desc: 'Đậu size Vừa.'
  },
  {
    id: 'la-164',
    icon: '🟢',
    name: 'Đậu To',
    type: 'la',
    seedPrice: 16,
    growTime: 17085,
    growStages: [1649, 4405, 14153, 17085],
    yield: 6,
    sellPrice: 22,
    xp: 6,
    desc: 'Đậu size To.'
  },
  {
    id: 'la-165',
    icon: '🟣',
    name: 'Đậu Khổng Lồ',
    type: 'la',
    seedPrice: 17,
    growTime: 56927,
    growStages: [36363, 37640, 41155, 56927],
    yield: 2,
    sellPrice: 8,
    xp: 7,
    desc: 'Đậu size Khổng Lồ.'
  },
  {
    id: 'la-166',
    icon: '🥦',
    name: 'Đậu Lùn',
    type: 'la',
    seedPrice: 18,
    growTime: 38046,
    growStages: [16905, 19001, 30370, 38046],
    yield: 3,
    sellPrice: 9,
    xp: 8,
    desc: 'Đậu size Lùn.'
  },
  {
    id: 'la-167',
    icon: '🥒',
    name: 'Đậu Cao',
    type: 'la',
    seedPrice: 19,
    growTime: 55452,
    growStages: [41783, 44117, 53708, 55452],
    yield: 4,
    sellPrice: 10,
    xp: 9,
    desc: 'Đậu size Cao.'
  },
  {
    id: 'la-168',
    icon: '🧅',
    name: 'Đậu Dài',
    type: 'la',
    seedPrice: 20,
    growTime: 31291,
    growStages: [6591, 10576, 18690, 31291],
    yield: 5,
    sellPrice: 11,
    xp: 2,
    desc: 'Đậu size Dài.'
  },
  {
    id: 'la-169',
    icon: '🧄',
    name: 'Đậu Tròn',
    type: 'la',
    seedPrice: 21,
    growTime: 33729,
    growStages: [18005, 22731, 32129, 33729],
    yield: 6,
    sellPrice: 12,
    xp: 3,
    desc: 'Đậu size Tròn.'
  },
  {
    id: 'la-170',
    icon: '🥬',
    name: 'Đậu Xoắn',
    type: 'la',
    seedPrice: 22,
    growTime: 53867,
    growStages: [21729, 22531, 34921, 53867],
    yield: 2,
    sellPrice: 13,
    xp: 4,
    desc: 'Đậu size Xoắn.'
  },
  {
    id: 'la-171',
    icon: '🌿',
    name: 'Su Su Mini',
    type: 'la',
    seedPrice: 23,
    growTime: 57162,
    growStages: [27443, 32967, 46335, 57162],
    yield: 3,
    sellPrice: 14,
    xp: 5,
    desc: 'Su Su size Mini.'
  },
  {
    id: 'la-172',
    icon: '🌱',
    name: 'Su Su Nhỏ',
    type: 'la',
    seedPrice: 24,
    growTime: 29672,
    growStages: [19553, 22006, 22398, 29672],
    yield: 4,
    sellPrice: 15,
    xp: 6,
    desc: 'Su Su size Nhỏ.'
  },
  {
    id: 'la-173',
    icon: '🍃',
    name: 'Su Su Vừa',
    type: 'la',
    seedPrice: 25,
    growTime: 56449,
    growStages: [28482, 30187, 39326, 56449],
    yield: 5,
    sellPrice: 16,
    xp: 7,
    desc: 'Su Su size Vừa.'
  },
  {
    id: 'la-174',
    icon: '🟢',
    name: 'Su Su To',
    type: 'la',
    seedPrice: 26,
    growTime: 65662,
    growStages: [26135, 32056, 44919, 65662],
    yield: 6,
    sellPrice: 17,
    xp: 8,
    desc: 'Su Su size To.'
  },
  {
    id: 'la-175',
    icon: '🟣',
    name: 'Su Su Khổng Lồ',
    type: 'la',
    seedPrice: 27,
    growTime: 54596,
    growStages: [35758, 40586, 42461, 54596],
    yield: 2,
    sellPrice: 18,
    xp: 9,
    desc: 'Su Su size Khổng Lồ.'
  },
  {
    id: 'la-176',
    icon: '🥦',
    name: 'Su Su Lùn',
    type: 'la',
    seedPrice: 28,
    growTime: 28876,
    growStages: [2025, 6888, 8717, 28876],
    yield: 3,
    sellPrice: 19,
    xp: 2,
    desc: 'Su Su size Lùn.'
  },
  {
    id: 'la-177',
    icon: '🥒',
    name: 'Su Su Cao',
    type: 'la',
    seedPrice: 29,
    growTime: 61197,
    growStages: [40510, 45938, 46157, 61197],
    yield: 4,
    sellPrice: 20,
    xp: 3,
    desc: 'Su Su size Cao.'
  },
  {
    id: 'la-178',
    icon: '🧅',
    name: 'Su Su Dài',
    type: 'la',
    seedPrice: 30,
    growTime: 49097,
    growStages: [23474, 29934, 36560, 49097],
    yield: 5,
    sellPrice: 21,
    xp: 4,
    desc: 'Su Su size Dài.'
  },
  {
    id: 'la-179',
    icon: '🧄',
    name: 'Su Su Tròn',
    type: 'la',
    seedPrice: 31,
    growTime: 26575,
    growStages: [7342, 13920, 25163, 26575],
    yield: 6,
    sellPrice: 22,
    xp: 5,
    desc: 'Su Su size Tròn.'
  },
  {
    id: 'la-180',
    icon: '🥬',
    name: 'Su Su Xoắn',
    type: 'la',
    seedPrice: 32,
    growTime: 53445,
    growStages: [20328, 22085, 36456, 53445],
    yield: 2,
    sellPrice: 8,
    xp: 6,
    desc: 'Su Su size Xoắn.'
  },
  {
    id: 'la-181',
    icon: '🌿',
    name: 'Khoai Mini',
    type: 'la',
    seedPrice: 33,
    growTime: 43915,
    growStages: [24320, 28434, 36365, 43915],
    yield: 3,
    sellPrice: 9,
    xp: 7,
    desc: 'Khoai size Mini.'
  },
  {
    id: 'la-182',
    icon: '🌱',
    name: 'Khoai Nhỏ',
    type: 'la',
    seedPrice: 34,
    growTime: 51655,
    growStages: [42514, 47612, 51011, 51655],
    yield: 4,
    sellPrice: 10,
    xp: 8,
    desc: 'Khoai size Nhỏ.'
  },
  {
    id: 'la-183',
    icon: '🍃',
    name: 'Khoai Vừa',
    type: 'la',
    seedPrice: 35,
    growTime: 39501,
    growStages: [24878, 27445, 35228, 39501],
    yield: 5,
    sellPrice: 11,
    xp: 9,
    desc: 'Khoai size Vừa.'
  },
  {
    id: 'la-184',
    icon: '🟢',
    name: 'Khoai To',
    type: 'la',
    seedPrice: 36,
    growTime: 64337,
    growStages: [39080, 45772, 50844, 64337],
    yield: 6,
    sellPrice: 12,
    xp: 2,
    desc: 'Khoai size To.'
  },
  {
    id: 'la-185',
    icon: '🟣',
    name: 'Khoai Khổng Lồ',
    type: 'la',
    seedPrice: 37,
    growTime: 14061,
    growStages: [2961, 3493, 13056, 14061],
    yield: 2,
    sellPrice: 13,
    xp: 3,
    desc: 'Khoai size Khổng Lồ.'
  },
  {
    id: 'la-186',
    icon: '🥦',
    name: 'Khoai Lùn',
    type: 'la',
    seedPrice: 38,
    growTime: 18516,
    growStages: [1350, 3313, 14850, 18516],
    yield: 3,
    sellPrice: 14,
    xp: 4,
    desc: 'Khoai size Lùn.'
  },
  {
    id: 'la-187',
    icon: '🥒',
    name: 'Khoai Cao',
    type: 'la',
    seedPrice: 39,
    growTime: 44653,
    growStages: [23129, 25627, 31143, 44653],
    yield: 4,
    sellPrice: 15,
    xp: 5,
    desc: 'Khoai size Cao.'
  },
  {
    id: 'la-188',
    icon: '🧅',
    name: 'Khoai Dài',
    type: 'la',
    seedPrice: 40,
    growTime: 58197,
    growStages: [37102, 44159, 44907, 58197],
    yield: 5,
    sellPrice: 16,
    xp: 6,
    desc: 'Khoai size Dài.'
  },
  {
    id: 'la-189',
    icon: '🧄',
    name: 'Khoai Tròn',
    type: 'la',
    seedPrice: 41,
    growTime: 26879,
    growStages: [6447, 11011, 19482, 26879],
    yield: 6,
    sellPrice: 17,
    xp: 7,
    desc: 'Khoai size Tròn.'
  },
  {
    id: 'la-190',
    icon: '🥬',
    name: 'Khoai Xoắn',
    type: 'la',
    seedPrice: 42,
    growTime: 29962,
    growStages: [13789, 19046, 21614, 29962],
    yield: 2,
    sellPrice: 18,
    xp: 8,
    desc: 'Khoai size Xoắn.'
  },
  {
    id: 'la-191',
    icon: '🌿',
    name: 'Cà Mini',
    type: 'la',
    seedPrice: 43,
    growTime: 44601,
    growStages: [17760, 18773, 28427, 44601],
    yield: 3,
    sellPrice: 19,
    xp: 9,
    desc: 'Cà size Mini.'
  },
  {
    id: 'la-192',
    icon: '🌱',
    name: 'Cà Nhỏ',
    type: 'la',
    seedPrice: 44,
    growTime: 31578,
    growStages: [7981, 9529, 20015, 31578],
    yield: 4,
    sellPrice: 20,
    xp: 2,
    desc: 'Cà size Nhỏ.'
  },
  {
    id: 'la-193',
    icon: '🍃',
    name: 'Cà Vừa',
    type: 'la',
    seedPrice: 45,
    growTime: 29789,
    growStages: [7629, 10995, 22719, 29789],
    yield: 5,
    sellPrice: 21,
    xp: 3,
    desc: 'Cà size Vừa.'
  },
  {
    id: 'la-194',
    icon: '🟢',
    name: 'Cà To',
    type: 'la',
    seedPrice: 46,
    growTime: 45641,
    growStages: [17011, 20925, 32404, 45641],
    yield: 6,
    sellPrice: 22,
    xp: 4,
    desc: 'Cà size To.'
  },
  {
    id: 'la-195',
    icon: '🟣',
    name: 'Cà Khổng Lồ',
    type: 'la',
    seedPrice: 47,
    growTime: 35340,
    growStages: [21939, 24186, 34335, 35340],
    yield: 2,
    sellPrice: 8,
    xp: 5,
    desc: 'Cà size Khổng Lồ.'
  },
  {
    id: 'la-196',
    icon: '🥦',
    name: 'Cà Lùn',
    type: 'la',
    seedPrice: 48,
    growTime: 56878,
    growStages: [18998, 24250, 35731, 56878],
    yield: 3,
    sellPrice: 9,
    xp: 6,
    desc: 'Cà size Lùn.'
  },
  {
    id: 'la-197',
    icon: '🥒',
    name: 'Cà Cao',
    type: 'la',
    seedPrice: 49,
    growTime: 68857,
    growStages: [41090, 42056, 55053, 68857],
    yield: 4,
    sellPrice: 10,
    xp: 7,
    desc: 'Cà size Cao.'
  },
  {
    id: 'la-198',
    icon: '🧅',
    name: 'Cà Dài',
    type: 'la',
    seedPrice: 50,
    growTime: 27220,
    growStages: [7536, 12574, 21344, 27220],
    yield: 5,
    sellPrice: 11,
    xp: 8,
    desc: 'Cà size Dài.'
  },
  {
    id: 'la-199',
    icon: '🧄',
    name: 'Cà Tròn',
    type: 'la',
    seedPrice: 51,
    growTime: 40388,
    growStages: [4586, 7023, 19853, 40388],
    yield: 6,
    sellPrice: 12,
    xp: 9,
    desc: 'Cà size Tròn.'
  },
  {
    id: 'la-200',
    icon: '🥬',
    name: 'Cà Xoắn',
    type: 'la',
    seedPrice: 12,
    growTime: 37439,
    growStages: [15499, 21061, 32076, 37439],
    yield: 2,
    sellPrice: 13,
    xp: 2,
    desc: 'Cà size Xoắn.'
  },
  {
    id: 'chu-a',
    icon: 'A',
    name: 'Hạt chữ A',
    type: 'kytu',
    seedPrice: 20,
    growTime: 27772,
    growStages: [14973, 18540, 21617, 27772],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái A.'
  },
  {
    id: 'chu-b',
    icon: 'B',
    name: 'Hạt chữ B',
    type: 'kytu',
    seedPrice: 20,
    growTime: 54077,
    growStages: [33949, 38479, 40866, 54077],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái B.'
  },
  {
    id: 'chu-c',
    icon: 'C',
    name: 'Hạt chữ C',
    type: 'kytu',
    seedPrice: 20,
    growTime: 55239,
    growStages: [23926, 26338, 39239, 55239],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái C.'
  },
  {
    id: 'chu-d',
    icon: 'D',
    name: 'Hạt chữ D',
    type: 'kytu',
    seedPrice: 20,
    growTime: 18998,
    growStages: [7850, 11437, 17456, 18998],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái D.'
  },
  {
    id: 'chu-e',
    icon: 'E',
    name: 'Hạt chữ E',
    type: 'kytu',
    seedPrice: 20,
    growTime: 30040,
    growStages: [11820, 12896, 23828, 30040],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái E.'
  },
  {
    id: 'chu-f',
    icon: 'F',
    name: 'Hạt chữ F',
    type: 'kytu',
    seedPrice: 20,
    growTime: 31546,
    growStages: [3908, 8937, 21640, 31546],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái F.'
  },
  {
    id: 'chu-g',
    icon: 'G',
    name: 'Hạt chữ G',
    type: 'kytu',
    seedPrice: 20,
    growTime: 53050,
    growStages: [32803, 39593, 48606, 53050],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái G.'
  },
  {
    id: 'chu-h',
    icon: 'H',
    name: 'Hạt chữ H',
    type: 'kytu',
    seedPrice: 20,
    growTime: 19744,
    growStages: [2549, 4216, 14041, 19744],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái H.'
  },
  {
    id: 'chu-i',
    icon: 'I',
    name: 'Hạt chữ I',
    type: 'kytu',
    seedPrice: 20,
    growTime: 21958,
    growStages: [908, 6401, 13615, 21958],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái I.'
  },
  {
    id: 'chu-j',
    icon: 'J',
    name: 'Hạt chữ J',
    type: 'kytu',
    seedPrice: 20,
    growTime: 71586,
    growStages: [42503, 47582, 58170, 71586],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái J.'
  },
  {
    id: 'chu-k',
    icon: 'K',
    name: 'Hạt chữ K',
    type: 'kytu',
    seedPrice: 20,
    growTime: 30897,
    growStages: [8502, 11559, 17541, 30897],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái K.'
  },
  {
    id: 'chu-l',
    icon: 'L',
    name: 'Hạt chữ L',
    type: 'kytu',
    seedPrice: 20,
    growTime: 41628,
    growStages: [19410, 26576, 37875, 41628],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái L.'
  },
  {
    id: 'chu-m',
    icon: 'M',
    name: 'Hạt chữ M',
    type: 'kytu',
    seedPrice: 20,
    growTime: 38462,
    growStages: [27605, 27716, 29914, 38462],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái M.'
  },
  {
    id: 'chu-n',
    icon: 'N',
    name: 'Hạt chữ N',
    type: 'kytu',
    seedPrice: 20,
    growTime: 47977,
    growStages: [15248, 16924, 30962, 47977],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái N.'
  },
  {
    id: 'chu-o',
    icon: 'O',
    name: 'Hạt chữ O',
    type: 'kytu',
    seedPrice: 20,
    growTime: 36119,
    growStages: [15220, 21199, 31735, 36119],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái O.'
  },
  {
    id: 'chu-p',
    icon: 'P',
    name: 'Hạt chữ P',
    type: 'kytu',
    seedPrice: 20,
    growTime: 44737,
    growStages: [25297, 30057, 40571, 44737],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái P.'
  },
  {
    id: 'chu-q',
    icon: 'Q',
    name: 'Hạt chữ Q',
    type: 'kytu',
    seedPrice: 20,
    growTime: 35822,
    growStages: [9723, 11690, 18307, 35822],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái Q.'
  },
  {
    id: 'chu-r',
    icon: 'R',
    name: 'Hạt chữ R',
    type: 'kytu',
    seedPrice: 20,
    growTime: 36499,
    growStages: [29900, 30893, 33750, 36499],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái R.'
  },
  {
    id: 'chu-s',
    icon: 'S',
    name: 'Hạt chữ S',
    type: 'kytu',
    seedPrice: 20,
    growTime: 40595,
    growStages: [13211, 13749, 21460, 40595],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái S.'
  },
  {
    id: 'chu-t',
    icon: 'T',
    name: 'Hạt chữ T',
    type: 'kytu',
    seedPrice: 20,
    growTime: 61351,
    growStages: [26094, 32866, 41308, 61351],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái T.'
  },
  {
    id: 'chu-u',
    icon: 'U',
    name: 'Hạt chữ U',
    type: 'kytu',
    seedPrice: 20,
    growTime: 18468,
    growStages: [3879, 7416, 12956, 18468],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái U.'
  },
  {
    id: 'chu-v',
    icon: 'V',
    name: 'Hạt chữ V',
    type: 'kytu',
    seedPrice: 20,
    growTime: 54090,
    growStages: [27651, 33388, 46673, 54090],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái V.'
  },
  {
    id: 'chu-w',
    icon: 'W',
    name: 'Hạt chữ W',
    type: 'kytu',
    seedPrice: 20,
    growTime: 66834,
    growStages: [40200, 44393, 54878, 66834],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái W.'
  },
  {
    id: 'chu-x',
    icon: 'X',
    name: 'Hạt chữ X',
    type: 'kytu',
    seedPrice: 20,
    growTime: 53402,
    growStages: [24680, 26494, 36673, 53402],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái X.'
  },
  {
    id: 'chu-y',
    icon: 'Y',
    name: 'Hạt chữ Y',
    type: 'kytu',
    seedPrice: 20,
    growTime: 61473,
    growStages: [40283, 45808, 46133, 61473],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái Y.'
  },
  {
    id: 'chu-z',
    icon: 'Z',
    name: 'Hạt chữ Z',
    type: 'kytu',
    seedPrice: 20,
    growTime: 49820,
    growStages: [20867, 27159, 28505, 49820],
    yield: 2,
    sellPrice: 15,
    xp: 3,
    desc: 'Hạt chữ cái Z.'
  },
  {
    id: 'so-0',
    icon: '0',
    name: 'Hạt số 0',
    type: 'kytu',
    seedPrice: 15,
    growTime: 51550,
    growStages: [34688, 39496, 45254, 51550],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 0.'
  },
  {
    id: 'so-1',
    icon: '1',
    name: 'Hạt số 1',
    type: 'kytu',
    seedPrice: 15,
    growTime: 27766,
    growStages: [8122, 8793, 19217, 27766],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 1.'
  },
  {
    id: 'so-2',
    icon: '2',
    name: 'Hạt số 2',
    type: 'kytu',
    seedPrice: 15,
    growTime: 40651,
    growStages: [29371, 33933, 37823, 40651],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 2.'
  },
  {
    id: 'so-3',
    icon: '3',
    name: 'Hạt số 3',
    type: 'kytu',
    seedPrice: 15,
    growTime: 71605,
    growStages: [42139, 42436, 51431, 71605],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 3.'
  },
  {
    id: 'so-4',
    icon: '4',
    name: 'Hạt số 4',
    type: 'kytu',
    seedPrice: 15,
    growTime: 27672,
    growStages: [25200, 25425, 26900, 27672],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 4.'
  },
  {
    id: 'so-5',
    icon: '5',
    name: 'Hạt số 5',
    type: 'kytu',
    seedPrice: 15,
    growTime: 48822,
    growStages: [30424, 37455, 41519, 48822],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 5.'
  },
  {
    id: 'so-6',
    icon: '6',
    name: 'Hạt số 6',
    type: 'kytu',
    seedPrice: 15,
    growTime: 58870,
    growStages: [40441, 42592, 48608, 58870],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 6.'
  },
  {
    id: 'so-7',
    icon: '7',
    name: 'Hạt số 7',
    type: 'kytu',
    seedPrice: 15,
    growTime: 39196,
    growStages: [21267, 27673, 31519, 39196],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 7.'
  },
  {
    id: 'so-8',
    icon: '8',
    name: 'Hạt số 8',
    type: 'kytu',
    seedPrice: 15,
    growTime: 55050,
    growStages: [32981, 34192, 35324, 55050],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 8.'
  },
  {
    id: 'so-9',
    icon: '9',
    name: 'Hạt số 9',
    type: 'kytu',
    seedPrice: 15,
    growTime: 35727,
    growStages: [11905, 13420, 18715, 35727],
    yield: 2,
    sellPrice: 12,
    xp: 2,
    desc: 'Hạt chữ số 9.'
  },
  {
    id: 'gen-917',
    icon: '🍃',
    name: 'Lá Đặc Biệt #917',
    type: 'la',
    seedPrice: 32,
    growTime: 36894,
    growStages: [3565, 10168, 18622, 36894],
    yield: 3,
    sellPrice: 47,
    xp: 7,
    desc: 'Giống Lá đặc biệt số 917.'
  },
  {
    id: 'gen-918',
    icon: '🥬',
    name: 'Rau Đặc Biệt #918',
    type: 'rau',
    seedPrice: 33,
    growTime: 38945,
    growStages: [18930, 22506, 36649, 38945],
    yield: 4,
    sellPrice: 48,
    xp: 8,
    desc: 'Giống Rau đặc biệt số 918.'
  },
  {
    id: 'gen-919',
    icon: '🌳',
    name: 'Cây Đặc Biệt #919',
    type: 'cay',
    seedPrice: 34,
    growTime: 62294,
    growStages: [40922, 47002, 60516, 62294],
    yield: 5,
    sellPrice: 49,
    xp: 9,
    desc: 'Giống Cây đặc biệt số 919.'
  },
  {
    id: 'gen-920',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #920',
    type: 'hoa',
    seedPrice: 35,
    growTime: 57936,
    growStages: [36527, 37618, 37984, 57936],
    yield: 1,
    sellPrice: 10,
    xp: 10,
    desc: 'Giống Hoa đặc biệt số 920.'
  },
  {
    id: 'gen-921',
    icon: '🍎',
    name: 'Quả Đặc Biệt #921',
    type: 'qua',
    seedPrice: 36,
    growTime: 51040,
    growStages: [33770, 37404, 39332, 51040],
    yield: 2,
    sellPrice: 11,
    xp: 11,
    desc: 'Giống Quả đặc biệt số 921.'
  },
  {
    id: 'gen-922',
    icon: '🍃',
    name: 'Lá Đặc Biệt #922',
    type: 'la',
    seedPrice: 37,
    growTime: 49709,
    growStages: [22739, 23151, 28875, 49709],
    yield: 3,
    sellPrice: 12,
    xp: 12,
    desc: 'Giống Lá đặc biệt số 922.'
  },
  {
    id: 'gen-923',
    icon: '🥬',
    name: 'Rau Đặc Biệt #923',
    type: 'rau',
    seedPrice: 38,
    growTime: 28666,
    growStages: [9764, 10962, 19217, 28666],
    yield: 4,
    sellPrice: 13,
    xp: 13,
    desc: 'Giống Rau đặc biệt số 923.'
  },
  {
    id: 'gen-924',
    icon: '🌳',
    name: 'Cây Đặc Biệt #924',
    type: 'cay',
    seedPrice: 39,
    growTime: 66719,
    growStages: [29595, 34719, 45134, 66719],
    yield: 5,
    sellPrice: 14,
    xp: 2,
    desc: 'Giống Cây đặc biệt số 924.'
  },
  {
    id: 'gen-925',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #925',
    type: 'hoa',
    seedPrice: 40,
    growTime: 34872,
    growStages: [21301, 25963, 27692, 34872],
    yield: 1,
    sellPrice: 15,
    xp: 3,
    desc: 'Giống Hoa đặc biệt số 925.'
  },
  {
    id: 'gen-926',
    icon: '🍎',
    name: 'Quả Đặc Biệt #926',
    type: 'qua',
    seedPrice: 41,
    growTime: 41744,
    growStages: [22314, 25303, 31599, 41744],
    yield: 2,
    sellPrice: 16,
    xp: 4,
    desc: 'Giống Quả đặc biệt số 926.'
  },
  {
    id: 'gen-927',
    icon: '🍃',
    name: 'Lá Đặc Biệt #927',
    type: 'la',
    seedPrice: 42,
    growTime: 60147,
    growStages: [32593, 37598, 46982, 60147],
    yield: 3,
    sellPrice: 17,
    xp: 5,
    desc: 'Giống Lá đặc biệt số 927.'
  },
  {
    id: 'gen-928',
    icon: '🥬',
    name: 'Rau Đặc Biệt #928',
    type: 'rau',
    seedPrice: 43,
    growTime: 49063,
    growStages: [20074, 21325, 32919, 49063],
    yield: 4,
    sellPrice: 18,
    xp: 6,
    desc: 'Giống Rau đặc biệt số 928.'
  },
  {
    id: 'gen-929',
    icon: '🌳',
    name: 'Cây Đặc Biệt #929',
    type: 'cay',
    seedPrice: 44,
    growTime: 22512,
    growStages: [2313, 7591, 18730, 22512],
    yield: 5,
    sellPrice: 19,
    xp: 7,
    desc: 'Giống Cây đặc biệt số 929.'
  },
  {
    id: 'gen-930',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #930',
    type: 'hoa',
    seedPrice: 45,
    growTime: 66832,
    growStages: [39991, 44381, 56972, 66832],
    yield: 1,
    sellPrice: 20,
    xp: 8,
    desc: 'Giống Hoa đặc biệt số 930.'
  },
  {
    id: 'gen-931',
    icon: '🍎',
    name: 'Quả Đặc Biệt #931',
    type: 'qua',
    seedPrice: 46,
    growTime: 58339,
    growStages: [32753, 33632, 40715, 58339],
    yield: 2,
    sellPrice: 21,
    xp: 9,
    desc: 'Giống Quả đặc biệt số 931.'
  },
  {
    id: 'gen-932',
    icon: '🍃',
    name: 'Lá Đặc Biệt #932',
    type: 'la',
    seedPrice: 47,
    growTime: 29988,
    growStages: [6676, 12621, 26250, 29988],
    yield: 3,
    sellPrice: 22,
    xp: 10,
    desc: 'Giống Lá đặc biệt số 932.'
  },
  {
    id: 'gen-933',
    icon: '🥬',
    name: 'Rau Đặc Biệt #933',
    type: 'rau',
    seedPrice: 48,
    growTime: 36520,
    growStages: [23214, 25998, 35552, 36520],
    yield: 4,
    sellPrice: 23,
    xp: 11,
    desc: 'Giống Rau đặc biệt số 933.'
  },
  {
    id: 'gen-934',
    icon: '🌳',
    name: 'Cây Đặc Biệt #934',
    type: 'cay',
    seedPrice: 49,
    growTime: 37068,
    growStages: [15331, 22270, 35788, 37068],
    yield: 5,
    sellPrice: 24,
    xp: 12,
    desc: 'Giống Cây đặc biệt số 934.'
  },
  {
    id: 'gen-935',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #935',
    type: 'hoa',
    seedPrice: 50,
    growTime: 30421,
    growStages: [15751, 16911, 25394, 30421],
    yield: 1,
    sellPrice: 25,
    xp: 13,
    desc: 'Giống Hoa đặc biệt số 935.'
  },
  {
    id: 'gen-936',
    icon: '🍎',
    name: 'Quả Đặc Biệt #936',
    type: 'qua',
    seedPrice: 51,
    growTime: 14871,
    growStages: [9905, 12261, 14553, 14871],
    yield: 2,
    sellPrice: 26,
    xp: 2,
    desc: 'Giống Quả đặc biệt số 936.'
  },
  {
    id: 'gen-937',
    icon: '🍃',
    name: 'Lá Đặc Biệt #937',
    type: 'la',
    seedPrice: 52,
    growTime: 20746,
    growStages: [7204, 10107, 18620, 20746],
    yield: 3,
    sellPrice: 27,
    xp: 3,
    desc: 'Giống Lá đặc biệt số 937.'
  },
  {
    id: 'gen-938',
    icon: '🥬',
    name: 'Rau Đặc Biệt #938',
    type: 'rau',
    seedPrice: 53,
    growTime: 62275,
    growStages: [33395, 35772, 45168, 62275],
    yield: 4,
    sellPrice: 28,
    xp: 4,
    desc: 'Giống Rau đặc biệt số 938.'
  },
  {
    id: 'gen-939',
    icon: '🌳',
    name: 'Cây Đặc Biệt #939',
    type: 'cay',
    seedPrice: 54,
    growTime: 43244,
    growStages: [12633, 19121, 25275, 43244],
    yield: 5,
    sellPrice: 29,
    xp: 5,
    desc: 'Giống Cây đặc biệt số 939.'
  },
  {
    id: 'gen-940',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #940',
    type: 'hoa',
    seedPrice: 55,
    growTime: 54522,
    growStages: [30239, 34591, 38926, 54522],
    yield: 1,
    sellPrice: 30,
    xp: 6,
    desc: 'Giống Hoa đặc biệt số 940.'
  },
  {
    id: 'gen-941',
    icon: '🍎',
    name: 'Quả Đặc Biệt #941',
    type: 'qua',
    seedPrice: 56,
    growTime: 64795,
    growStages: [31644, 35342, 45670, 64795],
    yield: 2,
    sellPrice: 31,
    xp: 7,
    desc: 'Giống Quả đặc biệt số 941.'
  },
  {
    id: 'gen-942',
    icon: '🍃',
    name: 'Lá Đặc Biệt #942',
    type: 'la',
    seedPrice: 57,
    growTime: 12531,
    growStages: [331, 6562, 8616, 12531],
    yield: 3,
    sellPrice: 32,
    xp: 8,
    desc: 'Giống Lá đặc biệt số 942.'
  },
  {
    id: 'gen-943',
    icon: '🥬',
    name: 'Rau Đặc Biệt #943',
    type: 'rau',
    seedPrice: 58,
    growTime: 47253,
    growStages: [31966, 37518, 40260, 47253],
    yield: 4,
    sellPrice: 33,
    xp: 9,
    desc: 'Giống Rau đặc biệt số 943.'
  },
  {
    id: 'gen-944',
    icon: '🌳',
    name: 'Cây Đặc Biệt #944',
    type: 'cay',
    seedPrice: 59,
    growTime: 60541,
    growStages: [27067, 32248, 45412, 60541],
    yield: 5,
    sellPrice: 34,
    xp: 10,
    desc: 'Giống Cây đặc biệt số 944.'
  },
  {
    id: 'gen-945',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #945',
    type: 'hoa',
    seedPrice: 60,
    growTime: 49226,
    growStages: [32897, 33916, 44589, 49226],
    yield: 1,
    sellPrice: 35,
    xp: 11,
    desc: 'Giống Hoa đặc biệt số 945.'
  },
  {
    id: 'gen-946',
    icon: '🍎',
    name: 'Quả Đặc Biệt #946',
    type: 'qua',
    seedPrice: 61,
    growTime: 66149,
    growStages: [35589, 39369, 50722, 66149],
    yield: 2,
    sellPrice: 36,
    xp: 12,
    desc: 'Giống Quả đặc biệt số 946.'
  },
  {
    id: 'gen-947',
    icon: '🍃',
    name: 'Lá Đặc Biệt #947',
    type: 'la',
    seedPrice: 62,
    growTime: 35160,
    growStages: [13558, 15815, 20014, 35160],
    yield: 3,
    sellPrice: 37,
    xp: 13,
    desc: 'Giống Lá đặc biệt số 947.'
  },
  {
    id: 'gen-948',
    icon: '🥬',
    name: 'Rau Đặc Biệt #948',
    type: 'rau',
    seedPrice: 63,
    growTime: 24872,
    growStages: [9923, 10123, 21494, 24872],
    yield: 4,
    sellPrice: 38,
    xp: 2,
    desc: 'Giống Rau đặc biệt số 948.'
  },
  {
    id: 'gen-949',
    icon: '🌳',
    name: 'Cây Đặc Biệt #949',
    type: 'cay',
    seedPrice: 64,
    growTime: 42003,
    growStages: [17502, 18659, 24285, 42003],
    yield: 5,
    sellPrice: 39,
    xp: 3,
    desc: 'Giống Cây đặc biệt số 949.'
  },
  {
    id: 'gen-950',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #950',
    type: 'hoa',
    seedPrice: 65,
    growTime: 53647,
    growStages: [36936, 37968, 49358, 53647],
    yield: 1,
    sellPrice: 40,
    xp: 4,
    desc: 'Giống Hoa đặc biệt số 950.'
  },
  {
    id: 'gen-951',
    icon: '🍎',
    name: 'Quả Đặc Biệt #951',
    type: 'qua',
    seedPrice: 66,
    growTime: 63654,
    growStages: [40988, 47108, 47596, 63654],
    yield: 2,
    sellPrice: 41,
    xp: 5,
    desc: 'Giống Quả đặc biệt số 951.'
  },
  {
    id: 'gen-952',
    icon: '🍃',
    name: 'Lá Đặc Biệt #952',
    type: 'la',
    seedPrice: 67,
    growTime: 43435,
    growStages: [27625, 28891, 38306, 43435],
    yield: 3,
    sellPrice: 42,
    xp: 6,
    desc: 'Giống Lá đặc biệt số 952.'
  },
  {
    id: 'gen-953',
    icon: '🥬',
    name: 'Rau Đặc Biệt #953',
    type: 'rau',
    seedPrice: 68,
    growTime: 33331,
    growStages: [751, 4292, 13124, 33331],
    yield: 4,
    sellPrice: 43,
    xp: 7,
    desc: 'Giống Rau đặc biệt số 953.'
  },
  {
    id: 'gen-954',
    icon: '🌳',
    name: 'Cây Đặc Biệt #954',
    type: 'cay',
    seedPrice: 69,
    growTime: 59991,
    growStages: [34907, 38314, 40681, 59991],
    yield: 5,
    sellPrice: 44,
    xp: 8,
    desc: 'Giống Cây đặc biệt số 954.'
  },
  {
    id: 'gen-955',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #955',
    type: 'hoa',
    seedPrice: 70,
    growTime: 42069,
    growStages: [9469, 12059, 26252, 42069],
    yield: 1,
    sellPrice: 45,
    xp: 9,
    desc: 'Giống Hoa đặc biệt số 955.'
  },
  {
    id: 'gen-956',
    icon: '🍎',
    name: 'Quả Đặc Biệt #956',
    type: 'qua',
    seedPrice: 71,
    growTime: 47739,
    growStages: [42621, 44728, 46828, 47739],
    yield: 2,
    sellPrice: 46,
    xp: 10,
    desc: 'Giống Quả đặc biệt số 956.'
  },
  {
    id: 'gen-957',
    icon: '🍃',
    name: 'Lá Đặc Biệt #957',
    type: 'la',
    seedPrice: 72,
    growTime: 48461,
    growStages: [30883, 36334, 42869, 48461],
    yield: 3,
    sellPrice: 47,
    xp: 11,
    desc: 'Giống Lá đặc biệt số 957.'
  },
  {
    id: 'gen-958',
    icon: '🥬',
    name: 'Rau Đặc Biệt #958',
    type: 'rau',
    seedPrice: 73,
    growTime: 53877,
    growStages: [31950, 38133, 44913, 53877],
    yield: 4,
    sellPrice: 48,
    xp: 12,
    desc: 'Giống Rau đặc biệt số 958.'
  },
  {
    id: 'gen-959',
    icon: '🌳',
    name: 'Cây Đặc Biệt #959',
    type: 'cay',
    seedPrice: 74,
    growTime: 51196,
    growStages: [32484, 35264, 49106, 51196],
    yield: 5,
    sellPrice: 49,
    xp: 13,
    desc: 'Giống Cây đặc biệt số 959.'
  },
  {
    id: 'gen-960',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #960',
    type: 'hoa',
    seedPrice: 75,
    growTime: 56015,
    growStages: [30186, 35719, 36324, 56015],
    yield: 1,
    sellPrice: 10,
    xp: 2,
    desc: 'Giống Hoa đặc biệt số 960.'
  },
  {
    id: 'gen-961',
    icon: '🍎',
    name: 'Quả Đặc Biệt #961',
    type: 'qua',
    seedPrice: 76,
    growTime: 68842,
    growStages: [36369, 37167, 50639, 68842],
    yield: 2,
    sellPrice: 11,
    xp: 3,
    desc: 'Giống Quả đặc biệt số 961.'
  },
  {
    id: 'gen-962',
    icon: '🍃',
    name: 'Lá Đặc Biệt #962',
    type: 'la',
    seedPrice: 77,
    growTime: 38704,
    growStages: [32624, 35158, 37256, 38704],
    yield: 3,
    sellPrice: 12,
    xp: 4,
    desc: 'Giống Lá đặc biệt số 962.'
  },
  {
    id: 'gen-963',
    icon: '🥬',
    name: 'Rau Đặc Biệt #963',
    type: 'rau',
    seedPrice: 78,
    growTime: 70051,
    growStages: [41768, 48841, 53686, 70051],
    yield: 4,
    sellPrice: 13,
    xp: 5,
    desc: 'Giống Rau đặc biệt số 963.'
  },
  {
    id: 'gen-964',
    icon: '🌳',
    name: 'Cây Đặc Biệt #964',
    type: 'cay',
    seedPrice: 79,
    growTime: 57294,
    growStages: [37128, 39228, 50402, 57294],
    yield: 5,
    sellPrice: 14,
    xp: 6,
    desc: 'Giống Cây đặc biệt số 964.'
  },
  {
    id: 'gen-965',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #965',
    type: 'hoa',
    seedPrice: 80,
    growTime: 31176,
    growStages: [5263, 6374, 11815, 31176],
    yield: 1,
    sellPrice: 15,
    xp: 7,
    desc: 'Giống Hoa đặc biệt số 965.'
  },
  {
    id: 'gen-966',
    icon: '🍎',
    name: 'Quả Đặc Biệt #966',
    type: 'qua',
    seedPrice: 81,
    growTime: 45387,
    growStages: [28855, 32101, 36495, 45387],
    yield: 2,
    sellPrice: 16,
    xp: 8,
    desc: 'Giống Quả đặc biệt số 966.'
  },
  {
    id: 'gen-967',
    icon: '🍃',
    name: 'Lá Đặc Biệt #967',
    type: 'la',
    seedPrice: 82,
    growTime: 33142,
    growStages: [10271, 17098, 31371, 33142],
    yield: 3,
    sellPrice: 17,
    xp: 9,
    desc: 'Giống Lá đặc biệt số 967.'
  },
  {
    id: 'gen-968',
    icon: '🥬',
    name: 'Rau Đặc Biệt #968',
    type: 'rau',
    seedPrice: 83,
    growTime: 14624,
    growStages: [1502, 2305, 13352, 14624],
    yield: 4,
    sellPrice: 18,
    xp: 10,
    desc: 'Giống Rau đặc biệt số 968.'
  },
  {
    id: 'gen-969',
    icon: '🌳',
    name: 'Cây Đặc Biệt #969',
    type: 'cay',
    seedPrice: 84,
    growTime: 64531,
    growStages: [38556, 41191, 55022, 64531],
    yield: 5,
    sellPrice: 19,
    xp: 11,
    desc: 'Giống Cây đặc biệt số 969.'
  },
  {
    id: 'gen-970',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #970',
    type: 'hoa',
    seedPrice: 85,
    growTime: 34508,
    growStages: [18712, 24253, 26180, 34508],
    yield: 1,
    sellPrice: 20,
    xp: 12,
    desc: 'Giống Hoa đặc biệt số 970.'
  },
  {
    id: 'gen-971',
    icon: '🍎',
    name: 'Quả Đặc Biệt #971',
    type: 'qua',
    seedPrice: 86,
    growTime: 63483,
    growStages: [34515, 38057, 48592, 63483],
    yield: 2,
    sellPrice: 21,
    xp: 13,
    desc: 'Giống Quả đặc biệt số 971.'
  },
  {
    id: 'gen-972',
    icon: '🍃',
    name: 'Lá Đặc Biệt #972',
    type: 'la',
    seedPrice: 87,
    growTime: 32521,
    growStages: [12541, 16053, 16599, 32521],
    yield: 3,
    sellPrice: 22,
    xp: 2,
    desc: 'Giống Lá đặc biệt số 972.'
  },
  {
    id: 'gen-973',
    icon: '🥬',
    name: 'Rau Đặc Biệt #973',
    type: 'rau',
    seedPrice: 88,
    growTime: 23886,
    growStages: [3778, 7041, 14155, 23886],
    yield: 4,
    sellPrice: 23,
    xp: 3,
    desc: 'Giống Rau đặc biệt số 973.'
  },
  {
    id: 'gen-974',
    icon: '🌳',
    name: 'Cây Đặc Biệt #974',
    type: 'cay',
    seedPrice: 89,
    growTime: 42038,
    growStages: [15353, 19228, 24849, 42038],
    yield: 5,
    sellPrice: 24,
    xp: 4,
    desc: 'Giống Cây đặc biệt số 974.'
  },
  {
    id: 'gen-975',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #975',
    type: 'hoa',
    seedPrice: 90,
    growTime: 52202,
    growStages: [39739, 42519, 51942, 52202],
    yield: 1,
    sellPrice: 25,
    xp: 5,
    desc: 'Giống Hoa đặc biệt số 975.'
  },
  {
    id: 'gen-976',
    icon: '🍎',
    name: 'Quả Đặc Biệt #976',
    type: 'qua',
    seedPrice: 91,
    growTime: 41515,
    growStages: [24958, 29374, 32294, 41515],
    yield: 2,
    sellPrice: 26,
    xp: 6,
    desc: 'Giống Quả đặc biệt số 976.'
  },
  {
    id: 'gen-977',
    icon: '🍃',
    name: 'Lá Đặc Biệt #977',
    type: 'la',
    seedPrice: 92,
    growTime: 18749,
    growStages: [3614, 9673, 10519, 18749],
    yield: 3,
    sellPrice: 27,
    xp: 7,
    desc: 'Giống Lá đặc biệt số 977.'
  },
  {
    id: 'gen-978',
    icon: '🥬',
    name: 'Rau Đặc Biệt #978',
    type: 'rau',
    seedPrice: 93,
    growTime: 38544,
    growStages: [5685, 5833, 17042, 38544],
    yield: 4,
    sellPrice: 28,
    xp: 8,
    desc: 'Giống Rau đặc biệt số 978.'
  },
  {
    id: 'gen-979',
    icon: '🌳',
    name: 'Cây Đặc Biệt #979',
    type: 'cay',
    seedPrice: 94,
    growTime: 53321,
    growStages: [37828, 41921, 47436, 53321],
    yield: 5,
    sellPrice: 29,
    xp: 9,
    desc: 'Giống Cây đặc biệt số 979.'
  },
  {
    id: 'gen-980',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #980',
    type: 'hoa',
    seedPrice: 95,
    growTime: 32888,
    growStages: [25803, 31085, 32374, 32888],
    yield: 1,
    sellPrice: 30,
    xp: 10,
    desc: 'Giống Hoa đặc biệt số 980.'
  },
  {
    id: 'gen-981',
    icon: '🍎',
    name: 'Quả Đặc Biệt #981',
    type: 'qua',
    seedPrice: 96,
    growTime: 23144,
    growStages: [14006, 16846, 19838, 23144],
    yield: 2,
    sellPrice: 31,
    xp: 11,
    desc: 'Giống Quả đặc biệt số 981.'
  },
  {
    id: 'gen-982',
    icon: '🍃',
    name: 'Lá Đặc Biệt #982',
    type: 'la',
    seedPrice: 97,
    growTime: 47872,
    growStages: [30076, 30923, 43290, 47872],
    yield: 3,
    sellPrice: 32,
    xp: 12,
    desc: 'Giống Lá đặc biệt số 982.'
  },
  {
    id: 'gen-983',
    icon: '🥬',
    name: 'Rau Đặc Biệt #983',
    type: 'rau',
    seedPrice: 98,
    growTime: 51082,
    growStages: [41179, 41799, 43262, 51082],
    yield: 4,
    sellPrice: 33,
    xp: 13,
    desc: 'Giống Rau đặc biệt số 983.'
  },
  {
    id: 'gen-984',
    icon: '🌳',
    name: 'Cây Đặc Biệt #984',
    type: 'cay',
    seedPrice: 99,
    growTime: 48597,
    growStages: [30271, 31686, 44066, 48597],
    yield: 5,
    sellPrice: 34,
    xp: 2,
    desc: 'Giống Cây đặc biệt số 984.'
  },
  {
    id: 'gen-985',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #985',
    type: 'hoa',
    seedPrice: 100,
    growTime: 40505,
    growStages: [3970, 9906, 19632, 40505],
    yield: 1,
    sellPrice: 35,
    xp: 3,
    desc: 'Giống Hoa đặc biệt số 985.'
  },
  {
    id: 'gen-986',
    icon: '🍎',
    name: 'Quả Đặc Biệt #986',
    type: 'qua',
    seedPrice: 101,
    growTime: 40106,
    growStages: [31828, 36050, 38945, 40106],
    yield: 2,
    sellPrice: 36,
    xp: 4,
    desc: 'Giống Quả đặc biệt số 986.'
  },
  {
    id: 'gen-987',
    icon: '🍃',
    name: 'Lá Đặc Biệt #987',
    type: 'la',
    seedPrice: 102,
    growTime: 62040,
    growStages: [32252, 34852, 46148, 62040],
    yield: 3,
    sellPrice: 37,
    xp: 5,
    desc: 'Giống Lá đặc biệt số 987.'
  },
  {
    id: 'gen-988',
    icon: '🥬',
    name: 'Rau Đặc Biệt #988',
    type: 'rau',
    seedPrice: 103,
    growTime: 48077,
    growStages: [13771, 16602, 27882, 48077],
    yield: 4,
    sellPrice: 38,
    xp: 6,
    desc: 'Giống Rau đặc biệt số 988.'
  },
  {
    id: 'gen-989',
    icon: '🌳',
    name: 'Cây Đặc Biệt #989',
    type: 'cay',
    seedPrice: 104,
    growTime: 46164,
    growStages: [35394, 39692, 43115, 46164],
    yield: 5,
    sellPrice: 39,
    xp: 7,
    desc: 'Giống Cây đặc biệt số 989.'
  },
  {
    id: 'gen-990',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #990',
    type: 'hoa',
    seedPrice: 15,
    growTime: 38454,
    growStages: [4738, 5651, 17444, 38454],
    yield: 1,
    sellPrice: 40,
    xp: 8,
    desc: 'Giống Hoa đặc biệt số 990.'
  },
  {
    id: 'gen-991',
    icon: '🍎',
    name: 'Quả Đặc Biệt #991',
    type: 'qua',
    seedPrice: 16,
    growTime: 34719,
    growStages: [13562, 16349, 27695, 34719],
    yield: 2,
    sellPrice: 41,
    xp: 9,
    desc: 'Giống Quả đặc biệt số 991.'
  },
  {
    id: 'gen-992',
    icon: '🍃',
    name: 'Lá Đặc Biệt #992',
    type: 'la',
    seedPrice: 17,
    growTime: 62889,
    growStages: [28247, 28732, 42004, 62889],
    yield: 3,
    sellPrice: 42,
    xp: 10,
    desc: 'Giống Lá đặc biệt số 992.'
  },
  {
    id: 'gen-993',
    icon: '🥬',
    name: 'Rau Đặc Biệt #993',
    type: 'rau',
    seedPrice: 18,
    growTime: 33618,
    growStages: [17202, 17640, 19704, 33618],
    yield: 4,
    sellPrice: 43,
    xp: 11,
    desc: 'Giống Rau đặc biệt số 993.'
  },
  {
    id: 'gen-994',
    icon: '🌳',
    name: 'Cây Đặc Biệt #994',
    type: 'cay',
    seedPrice: 19,
    growTime: 35435,
    growStages: [15899, 18457, 28079, 35435],
    yield: 5,
    sellPrice: 44,
    xp: 12,
    desc: 'Giống Cây đặc biệt số 994.'
  },
  {
    id: 'gen-995',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #995',
    type: 'hoa',
    seedPrice: 20,
    growTime: 45333,
    growStages: [27314, 31070, 33037, 45333],
    yield: 1,
    sellPrice: 45,
    xp: 13,
    desc: 'Giống Hoa đặc biệt số 995.'
  },
  {
    id: 'gen-996',
    icon: '🍎',
    name: 'Quả Đặc Biệt #996',
    type: 'qua',
    seedPrice: 21,
    growTime: 39582,
    growStages: [31400, 31937, 38906, 39582],
    yield: 2,
    sellPrice: 46,
    xp: 2,
    desc: 'Giống Quả đặc biệt số 996.'
  },
  {
    id: 'gen-997',
    icon: '🍃',
    name: 'Lá Đặc Biệt #997',
    type: 'la',
    seedPrice: 22,
    growTime: 73041,
    growStages: [40589, 43168, 56999, 73041],
    yield: 3,
    sellPrice: 47,
    xp: 3,
    desc: 'Giống Lá đặc biệt số 997.'
  },
  {
    id: 'gen-998',
    icon: '🥬',
    name: 'Rau Đặc Biệt #998',
    type: 'rau',
    seedPrice: 23,
    growTime: 74006,
    growStages: [32520, 38927, 52505, 74006],
    yield: 4,
    sellPrice: 48,
    xp: 4,
    desc: 'Giống Rau đặc biệt số 998.'
  },
  {
    id: 'gen-999',
    icon: '🌳',
    name: 'Cây Đặc Biệt #999',
    type: 'cay',
    seedPrice: 24,
    growTime: 16633,
    growStages: [7383, 7895, 12655, 16633],
    yield: 5,
    sellPrice: 49,
    xp: 5,
    desc: 'Giống Cây đặc biệt số 999.'
  },
  {
    id: 'gen-1000',
    icon: '🌸',
    name: 'Hoa Đặc Biệt #1000',
    type: 'hoa',
    seedPrice: 25,
    growTime: 42275,
    growStages: [25956, 30799, 39918, 42275],
    yield: 1,
    sellPrice: 10,
    xp: 6,
    desc: 'Giống Hoa đặc biệt số 1000.'
  },
];

const DEFAULT_FERTILIZERS = [
  {
    id: 'phan-thuong',
    icon: '🟤',
    name: 'Phân thường',
    price: 30,
    timeReduce: 0.10,
    yieldBonus: 0,
    desc: 'Phân cơ bản. Giảm 10% thời gian lớn.'
  },
  {
    id: 'phan-xanh',
    icon: '🟢',
    name: 'Phân xanh',
    price: 50,
    timeReduce: 0.15,
    yieldBonus: 0.05,
    desc: 'Phân hữu cơ. Giảm 15% thời gian, +5% sản lượng.'
  },
  {
    id: 'phan-vang',
    icon: '🟡',
    name: 'Phân vàng',
    price: 80,
    timeReduce: 0.20,
    yieldBonus: 0.10,
    desc: 'Phân trung cấp. Giảm 20% thời gian, +10% sản lượng.'
  },
  {
    id: 'phan-do',
    icon: '🔴',
    name: 'Phân đỏ',
    price: 120,
    timeReduce: 0.22,
    yieldBonus: 0.15,
    desc: 'Phân cao cấp. Giảm 22% thời gian, +15% sản lượng.'
  },
  {
    id: 'phan-tim',
    icon: '🟣',
    name: 'Phân tím',
    price: 180,
    timeReduce: 0.25,
    yieldBonus: 0.20,
    desc: 'Phân đặc biệt. Giảm 25% thời gian, +20% sản lượng.'
  },
  {
    id: 'phan-bac',
    icon: '⚪',
    name: 'Phân bạc',
    price: 250,
    timeReduce: 0.28,
    yieldBonus: 0.25,
    desc: 'Phân quý. Giảm 28% thời gian, +25% sản lượng.'
  },
  {
    id: 'phan-vang-kim',
    icon: '🟨',
    name: 'Phân vàng kim',
    price: 350,
    timeReduce: 0.32,
    yieldBonus: 0.30,
    desc: 'Phân hiếm. Giảm 32% thời gian, +30% sản lượng.'
  },
  {
    id: 'phan-kim-cuong',
    icon: '💎',
    name: 'Phân kim cương',
    price: 500,
    timeReduce: 0.35,
    yieldBonus: 0.40,
    desc: 'Phân cực phẩm. Giảm 35% thời gian, +40% sản lượng.'
  },
  {
    id: 'phan-huyen-thoai',
    icon: '🌟',
    name: 'Phân huyền thoại',
    price: 800,
    timeReduce: 0.40,
    yieldBonus: 0.50,
    desc: 'Phân thần thoại. Giảm 40% thời gian, +50% sản lượng.'
  },
  {
    id: 'phan-than-thoai',
    icon: '👑',
    name: 'Phân thần thoại',
    price: 1200,
    timeReduce: 0.45,
    yieldBonus: 0.60,
    desc: 'Phân tối thượng. Giảm 45% thời gian, +60% sản lượng.'
  }
];


const APP_VERSION = '1.9.63';

const DEFAULT_SETTINGS = {
  plotCount: 12,
  startCoins: 1000,
  rainChance: 15,          
  rainDurationMinutes: 0.25, 
  plotPrice: 500,
  
  mergeBaseRate: 25,
  
  appVersion: '1.9.62',
  
  siteIconUrl: '',
  
  updateNotes: '',
  
  forceUpdate: false
};


const DEFAULT_PROTECTS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(rate => ({
  id: 'bao-' + rate,
  icon: rate >= 80 ? '🛡️' : rate >= 50 ? '🧿' : '🔮',
  name: 'Bảo hộ +' + rate + '%',
  rate,
  price: Math.round(40 + rate * rate * 0.18),
  desc: 'Cộng thêm +' + rate + '% vào tỉ lệ ghép cơ bản (tối đa 100%, tối thiểu 1%).'
}));


const DEFAULT_FAIRY_PACKS = [
  { id: 'tien-1', days: 1, price: 200, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 1 ngày' },
  { id: 'tien-3', days: 3, price: 500, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 3 ngày' },
  { id: 'tien-5', days: 5, price: 750, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 5 ngày' },
  { id: 'tien-7', days: 7, price: 1000, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 7 ngày' },
  { id: 'tien-10', days: 10, price: 1300, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 10 ngày' },
  { id: 'tien-15', days: 15, price: 1800, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 15 ngày' },
  { id: 'tien-30', days: 30, price: 3000, icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>', name: 'Tiên 30 ngày' }
];


const DEFAULT_NYC_PACKS = [
  { id: 'nyc-1', days: 1, price: 250, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 1 ngày' },
  { id: 'nyc-3', days: 3, price: 650, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 3 ngày' },
  { id: 'nyc-5', days: 5, price: 950, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 5 ngày' },
  { id: 'nyc-7', days: 7, price: 1300, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 7 ngày' },
  { id: 'nyc-10', days: 10, price: 1700, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 10 ngày' },
  { id: 'nyc-15', days: 15, price: 2400, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 15 ngày' },
  { id: 'nyc-30', days: 30, price: 4000, icon: '<i class="fa-solid fa-heart-crack"></i>', name: 'NYC 30 ngày' }
];


const DEFAULT_HELPER_PACKS = [
  { id: 'help-1', days: 1, price: 180, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 1 ngày' },
  { id: 'help-3', days: 3, price: 450, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 3 ngày' },
  { id: 'help-5', days: 5, price: 700, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 5 ngày' },
  { id: 'help-7', days: 7, price: 950, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 7 ngày' },
  { id: 'help-10', days: 10, price: 1250, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 10 ngày' },
  { id: 'help-15', days: 15, price: 1700, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 15 ngày' },
  { id: 'help-30', days: 30, price: 2800, icon: '<i class="fa-solid fa-user-tie"></i>', name: 'Giúp việc 30 ngày' }
];

const TYPE_LABELS = {
  hoa: 'Hoa',
  qua: 'Quả',
  rau: 'Rau',
  cay: 'Cây cảnh',
  la: 'Lá',
  kytu: 'Ký tự',
  so: 'Số'
};


let currentUser = null;
let currentPlayer = null;
let currentPlants = [];
let currentSettings = { ...DEFAULT_SETTINGS };
let isAdmin = false;

function createDefaultPlayerData(uid, email, role) {
  const plotCount = currentSettings.plotCount || DEFAULT_SETTINGS.plotCount;
  const startCoins = currentSettings.startCoins || DEFAULT_SETTINGS.startCoins;

  
  const seeds = {};

  
  const fertilizers = {
    'phan-thuong': 5,
    'phan-xanh': 2
  };

  return {
    uid,
    email: email || '',
    role: role || 'user',
    coins: startCoins,
    level: 1,
    xp: 0,
    plots: Array(plotCount).fill(null).map((_, i) => ({
      id: i,
      plantId: null,
      plantedAt: null,
      watered: false,
      waterCount: 0,
      lastWatered: null,
      fertilizerId: null
    })),
    inventory: {
      seeds,
      harvest: {},
      fertilizers,
      protects: {},
      seedsStar: {}
    },
    stats: {
      planted: 0,
      harvested: 0,
      earned: 0,
      spent: 0
    },
    activity: [],
    lastDaily: null,
    collection: {},
    achievements: {},
    helpWaterLog: {},
    maxChatStreak: 0,
    fairyUntil: 0,
    fairyConfig: {
      waterMode: 'all',
      waterCount: 12,
      useFertilizer: true,
      fertSource: 'any',
      fertId: null,
      fertMode: 'all',
      fertCount: 12
    },
    nycUntil: 0,
    lastNycCare: 0,
    nycConfig: { plantId: null, mode: 'all', count: 1 },
    buffPrefs: { fairyEnabled: true, nycEnabled: true },
    createdAt: Date.now()
  };
}

async function initGlobalData() {
  const plantsSnap = await db.ref('plants').once('value');
  if (!plantsSnap.exists()) {
    const obj = {};
    DEFAULT_PLANTS.forEach(p => { obj[p.id] = p; });
    await db.ref('plants').set(obj);
    currentPlants = [...DEFAULT_PLANTS];
  } else {
    const val = plantsSnap.val() || {};
    
    let changed = false;
    DEFAULT_PLANTS.forEach(p => {
      if (!val[p.id]) {
        val[p.id] = p;
        changed = true;
      } else if (!val[p.id].growStages && p.growStages) {
        val[p.id].growStages = p.growStages;
        val[p.id].growTime = p.growTime;
        changed = true;
      }
    });
    if (changed) await db.ref('plants').set(val);
    currentPlants = Object.keys(val).map(k => ({ ...val[k], id: val[k].id || k }));
  }

  const setSnap = await db.ref('settings').once('value');
  if (!setSnap.exists()) {
    await db.ref('settings').set(DEFAULT_SETTINGS);
    currentSettings = { ...DEFAULT_SETTINGS };
  } else {
    currentSettings = { ...DEFAULT_SETTINGS, ...setSnap.val() };
  }
  try {
    if (typeof applySiteIcon === 'function') applySiteIcon(currentSettings.siteIconUrl);
  } catch (_) {}
}





let _serverTimeOffset = 0;
let _serverTimeReady = false;
const CLIENT_SESSION_ID = 's_' + Math.random().toString(36).slice(2, 10) + '_' + Date.now().toString(36);

let _playerBaseUpdatedAt = 0;
let _playerDirty = false;
let _pullRemoteBusy = false;

function nowMs() {
  
  return Date.now();
}


const GAME_TIMEZONE = 'Asia/Ho_Chi_Minh';
const GAME_TZ_OFFSET_MS = 7 * 60 * 60 * 1000;


function dateInGameTz(ms) {
  const t = (ms == null ? nowMs() : Number(ms));
  
  try {
    const parts = new Intl.DateTimeFormat('en-CA', {
      timeZone: GAME_TIMEZONE,
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    }).formatToParts(new Date(t));
    const get = (type) => {
      const p = parts.find(x => x.type === type);
      return p ? parseInt(p.value, 10) : 0;
    };
    return {
      year: get('year'),
      month: get('month'),
      day: get('day'),
      hour: get('hour') % 24,
      minute: get('minute'),
      second: get('second')
    };
  } catch (_) {
    const d = new Date(t + GAME_TZ_OFFSET_MS);
    return {
      year: d.getUTCFullYear(),
      month: d.getUTCMonth() + 1,
      day: d.getUTCDate(),
      hour: d.getUTCHours(),
      minute: d.getUTCMinutes(),
      second: d.getUTCSeconds()
    };
  }
}


function gameDayKey(ms) {
  const d = dateInGameTz(ms);
  const pad = n => String(n).padStart(2, '0');
  return d.year + '-' + pad(d.month) + '-' + pad(d.day);
}


function gameDateString(ms) {
  const d = dateInGameTz(ms);
  
  return gameDayKey(ms);
}


function formatGameDateTime(ms, withSeconds) {
  if (!ms) return '—';
  try {
    const opt = {
      timeZone: GAME_TIMEZONE,
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      hour12: false
    };
    if (withSeconds) opt.second = '2-digit';
    return new Date(ms).toLocaleString('vi-VN', opt);
  } catch (_) {
    return new Date(ms).toLocaleString('vi-VN');
  }
}



function markPlayerDirty() {
  _playerDirty = true;
}







function pendingSyncKey(uid) {
  return 'vx_pending_sync_' + (uid || (currentUser && currentUser.uid) || 'guest');
}
function playLogLocalKey(uid) {
  return 'vx_play_log_' + (uid || (currentUser && currentUser.uid) || 'guest');
}

function readLocalPlayLog(uid) {
  try {
    const raw = localStorage.getItem(playLogLocalKey(uid));
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch (_) {
    return [];
  }
}

function writeLocalPlayLog(uid, arr) {
  try {
    localStorage.setItem(playLogLocalKey(uid), JSON.stringify((arr || []).slice(0, 300)));
  } catch (_) {}
}

function markPendingSnapshot(action, at) {
  if (!currentUser || !currentPlayer) return;
  _playerDirty = true;
  try {
    localStorage.setItem(pendingSyncKey(currentUser.uid), JSON.stringify({
      synced: false,
      action: action || 'action',
      at: at || (typeof nowMs === 'function' ? nowMs() : Date.now()),
      updatedAt: Number(currentPlayer.updatedAt) || at || Date.now(),
      player: currentPlayer
    }));
  } catch (_) {}
  backupPlayerLocal();
}






function recordGameEvent(type, data) {
  if (!currentUser || !currentPlayer) return null;
  const t = typeof nowMs === 'function' ? nowMs() : Date.now();
  const entry = {
    id: 'l_' + t + '_' + Math.random().toString(36).slice(2, 8),
    type: String(type || 'other').slice(0, 24),
    a: String(type || 'other').slice(0, 48),
    t: t,
    data: data && typeof data === 'object' ? data : null,
    coins: Number(currentPlayer.coins) || 0,
    sessionId: CLIENT_SESSION_ID,
    _synced: false
  };

  if (!Array.isArray(currentPlayer.playLog)) currentPlayer.playLog = [];
  currentPlayer.playLog.unshift({
    a: entry.type,
    t: entry.t,
    d: data ? JSON.stringify(data).slice(0, 100) : null
  });
  if (currentPlayer.playLog.length > 150) currentPlayer.playLog.length = 150;

  const local = readLocalPlayLog(currentUser.uid);
  local.unshift(entry);
  writeLocalPlayLog(currentUser.uid, local.slice(0, 300));
  markPendingSnapshot(entry.type, t);

  
  if (db && currentUser) {
    const clean = {
      id: entry.id,
      type: entry.type,
      a: entry.a,
      t: entry.t,
      data: entry.data,
      coins: entry.coins,
      sessionId: entry.sessionId
    };
    db.ref('playLogs/' + currentUser.uid + '/' + entry.id).set(clean)
      .then(() => {
        try {
          const arr = readLocalPlayLog(currentUser.uid);
          const hit = arr.find(x => x && x.id === entry.id);
          if (hit) hit._synced = true;
          writeLocalPlayLog(currentUser.uid, arr);
        } catch (_) {}
      })
      .catch(e => console.warn('playLog push', e && e.message));
  }
  return entry;
}


function recordPlayerAction(action, detail) {
  return recordGameEvent(action || 'action', detail != null ? { detail: String(detail).slice(0, 120) } : null);
}


async function flushPlayLogsToFirebase() {
  if (!db || !currentUser) return { ok: false, n: 0 };
  const local = readLocalPlayLog(currentUser.uid);
  if (!local.length) return { ok: true, n: 0 };
  let n = 0;
  const pending = local.filter(e => e && e.id && !e._synced);
  for (const entry of pending.slice(0, 50)) {
    try {
      const clean = {
        id: entry.id,
        type: entry.type || entry.a,
        a: entry.a || entry.type,
        t: entry.t,
        data: entry.data || null,
        coins: entry.coins,
        sessionId: entry.sessionId
      };
      await db.ref('playLogs/' + currentUser.uid + '/' + entry.id).set(clean);
      entry._synced = true;
      n++;
    } catch (e) {
      console.warn('flushPlayLogs', e);
      break;
    }
  }
  writeLocalPlayLog(currentUser.uid, local);
  return { ok: true, n };
}





function applyCriticalPlayLogToPlayer(player) {
  if (!currentUser || !player) return null;
  const local = readLocalPlayLog(currentUser.uid);
  if (!local.length) return null;
  
  const now = typeof nowMs === 'function' ? nowMs() : Date.now();
  const cutoff = now - 48 * 3600 * 1000;
  const critical = local
    .filter(e => e && e.t >= cutoff && e.data && ['plant', 'water', 'fert', 'harvest'].includes(e.type || e.a))
    .slice()
    .sort((a, b) => (a.t || 0) - (b.t || 0));

  if (!critical.length) return null;

  if (typeof Game !== 'undefined' && Game.ensureGardens) {
    try {
      const prev = currentPlayer;
      currentPlayer = player;
      Game.ensureGardens();
      currentPlayer = prev;
    } catch (_) {}
  }

  let earliest = null;
  critical.forEach(e => {
    const d = e.data || {};
    const gi = typeof d.gardenIndex === 'number' ? d.gardenIndex : 0;
    const pi = typeof d.plotId === 'number' ? d.plotId : -1;
    if (pi < 0) return;
    if (!Array.isArray(player.gardens)) return;
    if (!player.gardens[gi]) return;
    let plots = player.gardens[gi];
    if (!Array.isArray(plots)) {
      const keys = Object.keys(plots || {}).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
      plots = keys.map(k => plots[k]);
      player.gardens[gi] = plots;
    }
    if (!plots[pi]) plots[pi] = { id: pi };
    const plot = plots[pi];
    const type = e.type || e.a;
    if (type === 'plant' && d.plantId) {
      
      if (!plot.plantId || (plot.plantedAt && d.plantedAt && plot.plantedAt > d.plantedAt)) {
        plot.plantId = d.plantId;
        plot.plantedAt = d.plantedAt || e.t;
        plot.watered = !!d.watered;
        plot.waterCount = d.waterCount || 0;
        plot.fertilizerId = d.fertilizerId || null;
        plot.seedKind = d.seedKind || 'normal';
      } else if (plot.plantId === d.plantId && d.plantedAt && (!plot.plantedAt || plot.plantedAt > d.plantedAt)) {
        plot.plantedAt = d.plantedAt;
      }
      earliest = earliest == null ? e.t : Math.min(earliest, e.t);
    } else if (type === 'water' && plot.plantId) {
      plot.watered = true;
      plot.waterCount = Math.max(plot.waterCount || 0, d.waterCount || 1);
      plot.lastWatered = d.at || e.t;
      earliest = earliest == null ? e.t : Math.min(earliest, e.t);
    } else if (type === 'fert' && plot.plantId && d.fertId) {
      if (!plot.fertilizerId) {
        plot.fertilizerId = d.fertId;
        plot.fertilizedAt = d.at || e.t;
      }
      earliest = earliest == null ? e.t : Math.min(earliest, e.t);
    } else if (type === 'harvest') {
      if (plot.plantId && (d.plantId ? plot.plantId === d.plantId : true)) {
        plot.plantId = null;
        plot.plantedAt = null;
        plot.watered = false;
        plot.waterCount = 0;
        plot.lastWatered = null;
        plot.fertilizerId = null;
        plot.fertilizedAt = null;
      }
      earliest = earliest == null ? e.t : Math.min(earliest, e.t);
    }
  });

  
  const ag = typeof player.activeGarden === 'number' ? player.activeGarden : 0;
  if (player.gardens && player.gardens[ag]) player.plots = player.gardens[ag];

  return earliest;
}




async function syncPlayerOnEnter() {
  if (!currentUser || !currentPlayer || !db) return { ok: false, msg: 'no-user' };
  let usedLocal = false;
  let logEarliest = null;

  try {
    const raw = localStorage.getItem(pendingSyncKey(currentUser.uid));
    if (raw) {
      const pending = JSON.parse(raw);
      if (pending && pending.player && pending.synced === false) {
        const pAt = Number(pending.updatedAt) || Number(pending.at) || 0;
        const rAt = Number(currentPlayer.updatedAt) || 0;
        const pScore = playerProgressScore(pending.player);
        const rScore = playerProgressScore(currentPlayer);
        if (pAt > rAt + 500 && (rScore < 1000 || pScore >= rScore * 0.75)) {
          currentPlayer = pending.player;
          _playerBaseUpdatedAt = Math.max(pAt, rAt);
          _playerDirty = true;
          usedLocal = true;
        }
      }
    }
  } catch (e) {
    console.warn('syncPlayerOnEnter pending', e);
  }

  
  try {
    logEarliest = applyCriticalPlayLogToPlayer(currentPlayer);
    if (logEarliest != null) {
      _playerDirty = true;
      
      
      const prevSeen = Number(currentPlayer.lastSeenAt) || 0;
      const prevCatch = Number(currentPlayer.lastCatchUpAt) || 0;
      
      if (logEarliest > prevCatch) {
        
        const targetFrom = Math.max(prevCatch, logEarliest - 1000);
        if (!prevSeen || prevSeen > targetFrom) {
          currentPlayer.lastSeenAt = targetFrom;
        }
        
        currentPlayer._needOfflineFromLog = true;
        currentPlayer._logEarliest = logEarliest;
      }
    }
  } catch (e) {
    console.warn('applyCriticalPlayLog', e);
  }

  try { await flushPlayLogsToFirebase(); } catch (_) {}

  if (_playerDirty || usedLocal) {
    const res = await savePlayer({
      action: usedLocal ? 'sync-pending' : 'enter-sync',
      silent: false
    });
    if (res && res.ok) {
      try {
        localStorage.setItem(pendingSyncKey(currentUser.uid), JSON.stringify({
          synced: true,
          at: typeof nowMs === 'function' ? nowMs() : Date.now(),
          updatedAt: currentPlayer.updatedAt
        }));
      } catch (_) {}
    }
    return Object.assign({}, res || {}, { usedLocal, logEarliest });
  }
  try { backupPlayerLocal(); } catch (_) {}
  return { ok: true, msg: 'up-to-date', usedLocal, logEarliest };
}


function playerBackupKey(uid) {
  return 'vx_player_backup_' + (uid || (currentUser && currentUser.uid) || 'guest');
}

function backupPlayerLocal() {
  try {
    if (!currentPlayer || !currentUser) return;
    const payload = {
      savedAt: typeof nowMs === 'function' ? nowMs() : Date.now(),
      updatedAt: Number(currentPlayer.updatedAt) || 0,
      player: currentPlayer
    };
    localStorage.setItem(playerBackupKey(currentUser.uid), JSON.stringify(payload));
  } catch (e) {
    console.warn('backupPlayerLocal', e);
  }
}


function playerProgressScore(p) {
  if (!p || typeof p !== 'object') return 0;
  let score = (Number(p.coins) || 0) + (Number(p.level) || 1) * 10000 + (Number(p.xp) || 0);
  const inv = p.inventory || {};
  const countBag = (bag) => {
    if (!bag || typeof bag !== 'object') return 0;
    return Object.keys(bag).reduce((s, k) => s + (Number(bag[k]) || 0), 0);
  };
  score += countBag(inv.seeds) * 50;
  score += countBag(inv.seedsStar) * 80;
  score += countBag(inv.harvest) * 30;
  score += countBag(inv.fertilizers) * 20;
  score += countBag(inv.protects) * 40;
  let plants = 0;
  const gardens = Array.isArray(p.gardens) ? p.gardens : null;
  if (gardens) {
    gardens.forEach(g => {
      const plots = Array.isArray(g) ? g : (g && g.plots) || [];
      (plots || []).forEach(pl => { if (pl && pl.plantId) plants++; });
    });
  } else {
    const plots = Array.isArray(p.plots) ? p.plots : Object.values(p.plots || {});
    plots.forEach(pl => { if (pl && pl.plantId) plants++; });
  }
  score += plants * 200;
  if (p.fairyUntil) score += 500;
  if (p.nycUntil) score += 500;
  if (p.helperUntil) score += 500;
  return score;
}







function mergeRemoteAdminGifts(remote) {
  if (!remote || !currentPlayer) return false;
  let changed = false;
  const rCoins = Number(remote.coins) || 0;
  const lCoins = Number(currentPlayer.coins) || 0;
  if (rCoins > lCoins) {
    currentPlayer.coins = rCoins;
    changed = true;
  }
  let rPlots = remote.plots;
  if (rPlots && !Array.isArray(rPlots)) rPlots = Object.values(rPlots);
  if (Array.isArray(rPlots) && Array.isArray(currentPlayer.plots) && rPlots.length > currentPlayer.plots.length) {
    for (let i = currentPlayer.plots.length; i < rPlots.length; i++) {
      const p = rPlots[i] || {};
      currentPlayer.plots.push({
        id: i,
        plantId: p.plantId || null,
        plantedAt: p.plantedAt || null,
        watered: !!p.watered,
        waterCount: typeof p.waterCount === 'number' ? p.waterCount : 0,
        lastWatered: p.lastWatered || null,
        fertilizerId: p.fertilizerId || null,
        fertilizedAt: p.fertilizedAt || null,
        specialMult: p.specialMult,
        specialId: p.specialId,
        specialName: p.specialName
      });
    }
    changed = true;
  }
  if (remote.role && remote.role !== currentPlayer.role) {
    currentPlayer.role = remote.role;
    changed = true;
  }
  if (remote.banned != null && !!remote.banned !== !!currentPlayer.banned) {
    currentPlayer.banned = !!remote.banned;
    currentPlayer.banReason = remote.banReason || null;
    changed = true;
  }
  
  if (Array.isArray(remote.activity) && remote.activity.length) {
    if (!Array.isArray(currentPlayer.activity)) currentPlayer.activity = [];
    const head = remote.activity[0];
    if (head && head.text && String(head.text).indexOf('Admin') === 0) {
      const exists = currentPlayer.activity.some(a => a && a.text === head.text && a.time === head.time);
      if (!exists) {
        currentPlayer.activity.unshift(head);
        if (currentPlayer.activity.length > 30) currentPlayer.activity = currentPlayer.activity.slice(0, 30);
        changed = true;
      }
    }
  }
  return changed;
}






function restorePlayerLocalIfNewer(remotePlayer) {
  try {
    if (!currentUser) return false;
    const raw = localStorage.getItem(playerBackupKey(currentUser.uid));
    if (!raw) return false;
    const payload = JSON.parse(raw);
    if (!payload || !payload.player) return false;
    const bAt = Number(payload.updatedAt) || Number(payload.savedAt) || 0;
    const rAt = remotePlayer ? (Number(remotePlayer.updatedAt) || 0) : 0;
    const bScore = playerProgressScore(payload.player);
    const rScore = playerProgressScore(remotePlayer);
    
    if (bAt > rAt + 1000 && (rScore < 1000 || bScore >= rScore * 0.8)) {
      currentPlayer = payload.player;
      _playerBaseUpdatedAt = bAt;
      _playerDirty = true;
      
      try { mergeRemoteAdminGifts(remotePlayer); } catch (_) {}
      return true;
    }
    
    if (rScore > bScore * 1.2 && rAt >= bAt) {
      try { localStorage.removeItem(playerBackupKey(currentUser.uid)); } catch (_) {}
    }
  } catch (e) {
    console.warn('restorePlayerLocalIfNewer', e);
  }
  return false;
}

async function initServerTime() {
  
  _serverTimeOffset = 0;
  _serverTimeReady = true;
  return 0;
}






async function pullRemotePlayerIfNewer() {
  if (!db || !currentUser || !currentPlayer || _pullRemoteBusy) return false;
  
  if (_playerDirty) {
    try { await savePlayer(); } catch (_) {}
    return false;
  }
  _pullRemoteBusy = true;
  try {
    const snap = await db.ref('users/' + currentUser.uid).once('value');
    if (!snap.exists()) return false;
    const remote = snap.val();
    const rAt = Number(remote.updatedAt) || 0;
    const lAt = Number(currentPlayer.updatedAt) || _playerBaseUpdatedAt || 0;
    
    if (rAt > lAt + 1500) {
      if (remote.sessionId && remote.sessionId !== CLIENT_SESSION_ID) {
        currentPlayer = remote;
        _playerBaseUpdatedAt = rAt;
        _playerDirty = false;
        if (typeof Game !== 'undefined' && Game.ensureGardens) {
          try { Game.ensureGardens(); Game.syncActiveGarden(); } catch (_) {}
        }
        return true;
      }
      
      if (mergeRemoteAdminGifts(remote)) {
        _playerBaseUpdatedAt = Math.max(_playerBaseUpdatedAt, rAt);
        return true;
      }
    }
    if (rAt > _playerBaseUpdatedAt) _playerBaseUpdatedAt = rAt;
    return false;
  } catch (e) {
    console.warn('pullRemotePlayerIfNewer', e);
    return false;
  } finally {
    _pullRemoteBusy = false;
  }
}

async function loadPlayer(uid, email) {
  if (typeof initServerTime === 'function') {
    try { await initServerTime(); } catch (_) {}
  }
  const snap = await db.ref('users/' + uid).once('value');
  if (!snap.exists()) {
    const usersSnap = await db.ref('users').once('value');
    const isFirst = !usersSnap.exists() || Object.keys(usersSnap.val() || {}).length === 0;
    const role = isFirst ? 'admin' : 'user';
    const data = createDefaultPlayerData(uid, email, role);
    data.updatedAt = nowMs();
    data.sessionId = CLIENT_SESSION_ID;
    data.lastSeenAt = nowMs();
    await db.ref('users/' + uid).set(data);
    currentPlayer = data;
    _playerBaseUpdatedAt = data.updatedAt;
    isAdmin = role === 'admin';
  } else {
    const remoteVal = snap.val();
    
    if (restorePlayerLocalIfNewer(remoteVal)) {
      
    } else {
      currentPlayer = remoteVal;
      _playerBaseUpdatedAt = Number(currentPlayer.updatedAt) || 0;
    }

    if (!currentPlayer.inventory) currentPlayer.inventory = { seeds: {}, harvest: {}, fertilizers: {} };
    if (!currentPlayer.inventory.seeds) currentPlayer.inventory.seeds = {};
    if (!currentPlayer.inventory.harvest) currentPlayer.inventory.harvest = {};
    
    if (typeof currentPlayer.inventory.fertilizer === 'number') {
      if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};
      currentPlayer.inventory.fertilizers['phan-vang'] = (currentPlayer.inventory.fertilizers['phan-vang'] || 0) + currentPlayer.inventory.fertilizer;
      delete currentPlayer.inventory.fertilizer;
    }
    if (!currentPlayer.inventory.fertilizers) currentPlayer.inventory.fertilizers = {};

    
    if (!currentPlayer.seedGiftRemoved) {
      currentPlayer.seedGiftRemoved = true;
    }

    
    if (Object.keys(currentPlayer.inventory.fertilizers || {}).length === 0) {
      currentPlayer.inventory.fertilizers = { 'phan-thuong': 5, 'phan-xanh': 2 };
    }

    if (!currentPlayer.stats) currentPlayer.stats = { planted: 0, harvested: 0, earned: 0, spent: 0 };
    if (!currentPlayer.activity) currentPlayer.activity = [];
    if (!currentPlayer.level) currentPlayer.level = 1;
    if (typeof currentPlayer.xp !== 'number') currentPlayer.xp = 0;
    if (!currentPlayer.collection) currentPlayer.collection = {};
    if (!currentPlayer.achievements) currentPlayer.achievements = {};
    if (!currentPlayer.helpWaterLog) currentPlayer.helpWaterLog = {};
    if (typeof currentPlayer.maxChatStreak !== 'number') currentPlayer.maxChatStreak = 0;
    if (!currentPlayer.inventory.protects) currentPlayer.inventory.protects = {};
    if (!currentPlayer.inventory.seedsStar) currentPlayer.inventory.seedsStar = {};
    if (typeof currentPlayer.fairyUntil !== 'number') currentPlayer.fairyUntil = 0;
    if (typeof currentPlayer.lastFairyCare !== 'number') currentPlayer.lastFairyCare = 0;
    if (typeof currentPlayer.helperUntil !== 'number') currentPlayer.helperUntil = 0;
    if (typeof currentPlayer.lastSeenAt !== 'number') currentPlayer.lastSeenAt = nowMs();
    if (typeof currentPlayer.lastCatchUpAt !== 'number') currentPlayer.lastCatchUpAt = 0;
    if (typeof currentPlayer.updatedAt !== 'number') currentPlayer.updatedAt = _playerBaseUpdatedAt || nowMs();
    if (typeof currentPlayer.lastHelperBuy !== 'number') currentPlayer.lastHelperBuy = 0;
    if (!currentPlayer.fairyConfig || typeof currentPlayer.fairyConfig !== 'object') {
      currentPlayer.fairyConfig = {
        waterMode: 'all', waterCount: 12, useFertilizer: true,
        fertSource: 'any', fertId: null, fertMode: 'all', fertCount: 12
      };
    }
    if (typeof currentPlayer.nycUntil !== 'number') currentPlayer.nycUntil = 0;
    if (typeof currentPlayer.lastNycCare !== 'number') currentPlayer.lastNycCare = 0;
    if (!currentPlayer.nycConfig || typeof currentPlayer.nycConfig !== 'object') {
      currentPlayer.nycConfig = { plantId: null, mode: 'all', count: 1 };
    } else {
      if (!('plantId' in currentPlayer.nycConfig)) currentPlayer.nycConfig.plantId = null;
      if (!currentPlayer.nycConfig.mode) currentPlayer.nycConfig.mode = 'all';
      if (typeof currentPlayer.nycConfig.count !== 'number') currentPlayer.nycConfig.count = 1;
    }
    if (!currentPlayer.buffPrefs || typeof currentPlayer.buffPrefs !== 'object') {
      currentPlayer.buffPrefs = { fairyEnabled: true, nycEnabled: true };
    } else {
      if (typeof currentPlayer.buffPrefs.fairyEnabled !== 'boolean') currentPlayer.buffPrefs.fairyEnabled = true;
      if (typeof currentPlayer.buffPrefs.nycEnabled !== 'boolean') currentPlayer.buffPrefs.nycEnabled = true;
    }

    if (!Array.isArray(currentPlayer.plots)) {
      const plotCount = currentSettings.plotCount || 12;
      currentPlayer.plots = Array(plotCount).fill(null).map((_, i) => ({
        id: i, plantId: null, plantedAt: null, watered: false, waterCount: 0, lastWatered: null, fertilizerId: null
      }));
    }
    if (!Array.isArray(currentPlayer.plots)) {
      currentPlayer.plots = Object.values(currentPlayer.plots);
    }
    currentPlayer.plots.forEach((p, i) => {
      if (typeof p.waterCount !== 'number') p.waterCount = p.watered ? 1 : 0;
      
      if (p.fertilizer === true && !p.fertilizerId) p.fertilizerId = 'phan-vang';
      if (p.fertilizerId === undefined) p.fertilizerId = null;
      delete p.fertilizer;
      p.id = i;
    });

    isAdmin = currentPlayer.role === 'admin';
    if (!currentPlayer.helpWaterLog) currentPlayer.helpWaterLog = {};
    if (typeof Game !== 'undefined' && Game.applyPendingHelps) {
      await Game.applyPendingHelps();
    }
    
    if (typeof Game !== 'undefined' && Game.ensureGardens) {
      try { Game.ensureGardens(); } catch (_) {}
    }
    
    try {
      if (typeof Features !== 'undefined' && Features.claimMarketCredits) {
        const cr = await Features.claimMarketCredits();
        if (cr && cr.claimed > 0) _playerDirty = true;
      }
    } catch (_) {}

    
    if (_playerDirty) {
      try { await savePlayer(); } catch (_) {}
    } else {
      
      try { backupPlayerLocal(); } catch (_) {}
    }
  }
  return currentPlayer;
}


let _lastSaveOkToastAt = 0;
function notifyFirebaseSave(ok, msg, opts) {
  if (typeof showToast !== 'function') return;
  const silent = opts && opts.silent;
  try {
    if (ok) {
      if (silent) return;
      const now = Date.now();
      
      if (now - _lastSaveOkToastAt < 1200) return;
      _lastSaveOkToastAt = now;
      showToast('☁️ Đã lưu lên Firebase', 'success');
    } else {
      
      showToast('⚠️ Chưa lên Firebase' + (msg ? ': ' + msg : '') + ' — F5 có thể mất tiến trình', 'error');
    }
  } catch (_) {}
}






async function savePlayer(opts) {
  opts = opts || {};
  if (!currentUser || !currentPlayer || !db) {
    const r = { ok: false, msg: 'Chưa đăng nhập / chưa có DB' };
    notifyFirebaseSave(false, r.msg, opts);
    return r;
  }
  
  try {
    if (typeof Features !== 'undefined' && Features.claimMarketCredits) {
      await Features.claimMarketCredits();
    }
  } catch (_) {}
  
  if (opts.action && opts.action !== 'enter-sync') {
    try { recordPlayerAction(opts.action, opts.detail || null); } catch (_) {}
  } else if (!opts.silent && !opts.action) {
    try { recordPlayerAction('save', null); } catch (_) {}
  }
  if (typeof Game !== 'undefined' && Game.ensureGardens) {
    try {
      Game.ensureGardens();
      Game.syncActiveGarden();
    } catch (_) {}
  }
  if (typeof currentPlayer.fairyUntil !== 'number') currentPlayer.fairyUntil = 0;
  if (typeof currentPlayer.lastFairyCare !== 'number') currentPlayer.lastFairyCare = 0;
  if (typeof currentPlayer.nycUntil !== 'number') currentPlayer.nycUntil = 0;
  if (typeof currentPlayer.lastNycCare !== 'number') currentPlayer.lastNycCare = 0;

  const t = typeof nowMs === 'function' ? nowMs() : Date.now();
  currentPlayer.timersSyncedAt = t;
  
  
  if (typeof currentPlayer.lastSeenAt !== 'number' || !currentPlayer.lastSeenAt) {
    currentPlayer.lastSeenAt = t;
  }
  currentPlayer.sessionId = CLIENT_SESSION_ID;
  const prev = Math.max(
    Number(currentPlayer.updatedAt) || 0,
    Number(_playerBaseUpdatedAt) || 0
  );
  currentPlayer.updatedAt = Math.max(t, prev + 1);
  _playerDirty = true;

  
  backupPlayerLocal();

  const ref = db.ref('users/' + currentUser.uid);
  let lastErr = null;
  
  try {
    const pre = await ref.once('value');
    if (pre.exists()) {
      const remote = pre.val();
      const rAt = Number(remote.updatedAt) || 0;
      if (rAt > (Number(_playerBaseUpdatedAt) || 0)) {
        mergeRemoteAdminGifts(remote);
        
        if (rAt > (Number(_playerBaseUpdatedAt) || 0)) {
          _playerBaseUpdatedAt = rAt;
        }
        
        currentPlayer.updatedAt = Math.max(
          Number(currentPlayer.updatedAt) || 0,
          rAt + 1,
          typeof nowMs === 'function' ? nowMs() : Date.now()
        );
      }
    }
  } catch (_) {}

  
  let payload;
  try {
    payload = JSON.parse(JSON.stringify(currentPlayer));
  } catch (e) {
    payload = currentPlayer;
  }
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await ref.set(payload);
      _playerBaseUpdatedAt = currentPlayer.updatedAt;
      _playerDirty = false;
      backupPlayerLocal();
      try {
        if (typeof Game !== 'undefined' && Game.updateLeaderboard) await Game.updateLeaderboard();
      } catch (_) {}
      try {
        if (typeof Game !== 'undefined' && Game.publishPublicGarden) await Game.publishPublicGarden();
      } catch (_) {}
      try {
        if (currentUser) {
          localStorage.setItem(pendingSyncKey(currentUser.uid), JSON.stringify({
            synced: true,
            at: currentPlayer.updatedAt,
            updatedAt: currentPlayer.updatedAt
          }));
        }
      } catch (_) {}
      
      try { flushPlayLogsToFirebase(); } catch (_) {}
      notifyFirebaseSave(true, null, opts);
      return { ok: true };
    } catch (e) {
      lastErr = e;
      console.warn('savePlayer attempt ' + attempt, e && e.message ? e.message : e);
      await new Promise(r => setTimeout(r, 350 * attempt));
    }
  }
  _playerDirty = true;
  const msg = (lastErr && lastErr.message) ? lastErr.message : 'Lỗi lưu Firebase';
  console.error('savePlayer FAILED', msg);
  notifyFirebaseSave(false, msg, opts);
  return { ok: false, msg };
}





let _timerSyncBusy = false;
let _timerSyncQueued = false;






async function syncTimersToFirebase() {
  return;
}


let _savePlayerDebounceTimer = null;
function scheduleSavePlayer(delayMs = 800) {
  if (!currentUser || !currentPlayer) return;
  _playerDirty = true;
  backupPlayerLocal();
  if (_savePlayerDebounceTimer) clearTimeout(_savePlayerDebounceTimer);
  _savePlayerDebounceTimer = setTimeout(() => {
    _savePlayerDebounceTimer = null;
    savePlayer().catch(e => console.warn('scheduleSavePlayer', e));
  }, delayMs);
}


function flushSavePlayer() {
  if (!currentUser || !currentPlayer) return;
  if (_savePlayerDebounceTimer) {
    clearTimeout(_savePlayerDebounceTimer);
    _savePlayerDebounceTimer = null;
  }
  backupPlayerLocal();
  
  return savePlayer({ silent: true }).catch(e => console.warn('flushSavePlayer', e));
}


if (typeof window !== 'undefined' && !window.__vxOnlineSaveBound) {
  window.__vxOnlineSaveBound = true;
  window.addEventListener('online', () => {
    flushSavePlayer();
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      
      flushSavePlayer();
    } else if (_playerDirty) {
      flushSavePlayer();
    }
  });
  window.addEventListener('pagehide', () => {
    backupPlayerLocal();
    flushSavePlayer();
  });
  window.addEventListener('beforeunload', () => {
    backupPlayerLocal();
  });
}





let _playerTimerUnsub = null;
function listenPlayerTimers() {
  
  if (_playerTimerUnsub && currentUser && db) {
    try { db.ref('users/' + currentUser.uid).off('value', _playerTimerUnsub); } catch (_) {}
  }
  _playerTimerUnsub = null;
}

function stopListenPlayerTimers() {
  if (_playerTimerUnsub && currentUser && db) {
    try { db.ref('users/' + currentUser.uid).off('value', _playerTimerUnsub); } catch (_) {}
  }
  _playerTimerUnsub = null;
}

async function refreshPlants() {
  const snap = await db.ref('plants').once('value');
  if (snap.exists()) {
    const val = snap.val();
    currentPlants = Object.keys(val).map(k => ({ ...val[k], id: val[k].id || k }));
  }
}

async function savePlants() {
  const obj = {};
  currentPlants.forEach(p => { obj[p.id] = p; });
  await db.ref('plants').set(obj);
}

async function saveSettings() {
  await db.ref('settings').set(currentSettings);
}

function getFertilizer(id) {
  return DEFAULT_FERTILIZERS.find(f => f.id === id);
}



const DEFAULT_PETS = [
  { id: 'pet-meo-trang', icon: '🐱', name: 'Mèo trắng', price: 800, species: 'cat', coinChance: 0.008, coinMin: 1, coinMax: 3, desc: 'Đi dạo quanh vườn. Hiếm khi nhặt được vài xu.' },
  { id: 'pet-meo-den', icon: '🐈‍⬛', name: 'Mèo đen', price: 1200, species: 'cat', coinChance: 0.01, coinMin: 1, coinMax: 4, desc: 'May mắn hơn một chút khi nhặt xu.' },
  { id: 'pet-cho-vang', icon: '🐶', name: 'Chó vàng', price: 900, species: 'dog', coinChance: 0.009, coinMin: 1, coinMax: 3, desc: 'Chạy quanh hàng rào, thỉnh thoảng nhặt xu.' },
  { id: 'pet-cho-shiba', icon: '🐕', name: 'Shiba', price: 1500, species: 'dog', coinChance: 0.012, coinMin: 1, coinMax: 5, desc: 'Shiba tinh anh — tỉ lệ nhặt xu hơi cao hơn.' },
  { id: 'pet-meo-cam', icon: '😺', name: 'Mèo cam', price: 1000, species: 'cat', coinChance: 0.009, coinMin: 1, coinMax: 3, desc: 'Mèo cam béo, đi chậm nhưng dễ thương.' },
  { id: 'pet-cho-corgi', icon: '🦮', name: 'Corgi', price: 1800, species: 'dog', coinChance: 0.011, coinMin: 1, coinMax: 4, desc: 'Chân ngắn, uy tín dài.' },
  { id: 'pet-tho', icon: '🐰', name: 'Thỏ con', price: 700, species: 'other', coinChance: 0.007, coinMin: 1, coinMax: 2, desc: 'Nhảy quanh luống rau.' },
  { id: 'pet-vit', icon: '🦆', name: 'Vịt vàng', price: 650, species: 'other', coinChance: 0.007, coinMin: 1, coinMax: 2, desc: 'Kêu cạp cạp gần ao (tưởng tượng).' },
  { id: 'pet-hamster', icon: '🐹', name: 'Hamster', price: 750, species: 'other', coinChance: 0.008, coinMin: 1, coinMax: 3, desc: 'Phồng má, thỉnh thoảng nhặt xu.' },
  { id: 'pet-panda', icon: '🐼', name: 'Gấu trúc', price: 2500, species: 'other', coinChance: 0.014, coinMin: 2, coinMax: 6, desc: 'Hiếm & đáng yêu — nhặt xu khá tốt.' },
  { id: 'pet-fox', icon: '🦊', name: 'Cáo cam', price: 2000, species: 'other', coinChance: 0.013, coinMin: 1, coinMax: 5, desc: 'Lanh lợi, tỉ lệ nhặt xu cao.' },
  { id: 'pet-owl', icon: '🦉', name: 'Cú mèo', price: 1600, species: 'other', coinChance: 0.01, coinMin: 1, coinMax: 4, desc: 'Canh vườn ban đêm.' },
  { id: 'pet-penguin', icon: '🐧', name: 'Chim cánh cụt', price: 2200, species: 'other', coinChance: 0.012, coinMin: 1, coinMax: 5, desc: 'Lách cách đi quanh luống.' },
  { id: 'pet-frog', icon: '🐸', name: 'Ếch xanh', price: 600, species: 'other', coinChance: 0.006, coinMin: 1, coinMax: 2, desc: 'Nhảy gần vòi nước.' }
];






const KITCHEN_STYLES = [
  { key: 'salad', name: 'Salad', icon: '🥗', mult: 1.15 },
  { key: 'soup', name: 'Súp', icon: '🍲', mult: 1.25 },
  { key: 'grill', name: 'Nướng', icon: '🔥', mult: 1.35 },
  { key: 'fry', name: 'Chiên', icon: '🍳', mult: 1.3 },
  { key: 'steam', name: 'Hấp', icon: '🥟', mult: 1.2 },
  { key: 'smoothie', name: 'Sinh tố', icon: '🥤', mult: 1.18 },
  { key: 'cake', name: 'Bánh', icon: '🍰', mult: 1.4 },
  { key: 'jam', name: 'Mứt', icon: '🫙', mult: 1.22 },
  { key: 'tea', name: 'Trà', icon: '🍵', mult: 1.12 },
  { key: 'hotpot', name: 'Lẩu', icon: '🥘', mult: 1.45 },
  { key: 'rice', name: 'Cơm trộn', icon: '🍱', mult: 1.28 },
  { key: 'pickle', name: 'Muối chua', icon: '🥒', mult: 1.1 },
  { key: 'dessert', name: 'Tráng miệng', icon: '🍮', mult: 1.38 },
  { key: 'juice', name: 'Nước ép', icon: '🧃', mult: 1.16 },
  { key: 'roast', name: 'Rang', icon: '☕', mult: 1.24 }
];

let _RECIPE_CACHE = null;
function buildKitchenRecipes(plants) {
  if (_RECIPE_CACHE && _RECIPE_CACHE.length) return _RECIPE_CACHE;
  const list = Array.isArray(plants) && plants.length ? plants : (typeof DEFAULT_PLANTS !== 'undefined' ? DEFAULT_PLANTS : []);
  const recipes = [];
  const styles = KITCHEN_STYLES;
  let idx = 0;
  
  for (let i = 0; i < list.length && recipes.length < 1000; i++) {
    const p = list[i];
    if (!p || !p.id) continue;
    for (let s = 0; s < styles.length && recipes.length < 1000; s++) {
      const st = styles[s];
      const need = 1 + (s % 3); 
      const base = Math.max(2, Number(p.sellPrice) || 10);
      const sell = Math.max(need + 1, Math.floor(base * need * st.mult));
      recipes.push({
        id: 'rcp-' + st.key + '-' + p.id,
        name: st.name + ' ' + (p.name || p.id),
        icon: st.icon,
        ingredients: [{ plantId: p.id, qty: need }],
        sellPrice: sell,
        xp: Math.max(1, Math.floor(sell / 20))
      });
      idx++;
    }
  }
  
  for (let i = 0; i < list.length - 1 && recipes.length < 1000; i++) {
    const a = list[i], b = list[i + 1];
    if (!a || !b) continue;
    const st = styles[i % styles.length];
    const sell = Math.floor(((Number(a.sellPrice) || 10) + (Number(b.sellPrice) || 10)) * st.mult);
    recipes.push({
      id: 'rcp-mix-' + a.id + '-' + b.id,
      name: st.name + ' ' + a.name + ' & ' + b.name,
      icon: st.icon,
      ingredients: [
        { plantId: a.id, qty: 1 },
        { plantId: b.id, qty: 1 }
      ],
      sellPrice: Math.max(5, sell),
      xp: Math.max(1, Math.floor(sell / 18))
    });
  }
  _RECIPE_CACHE = recipes.slice(0, 1000);
  return _RECIPE_CACHE;
}

function getKitchenRecipes() {
  const plants = (typeof currentPlants !== 'undefined' && currentPlants && currentPlants.length)
    ? currentPlants
    : (typeof DEFAULT_PLANTS !== 'undefined' ? DEFAULT_PLANTS : []);
  return buildKitchenRecipes(plants);
}
function getKitchenRecipe(id) {
  return getKitchenRecipes().find(r => r.id === id);
}
function getPets() { return DEFAULT_PETS; }
function getPet(id) { return DEFAULT_PETS.find(p => p.id === id); }

// ========== CHĂN NUÔI (nền tảng — thêm loài sau) ==========
// Mỗi loài: id, name, icon, type (ga|lon|bo|...), buyPrice, growTime (giây đến trưởng thành),
// productId/productName/productIcon, productInterval (giây giữa các lần thu), productYield, feedCost, sellPrice, xp
const DEFAULT_ANIMALS = [
  // Ví dụ khung — bạn có thể thêm gà, lợn, bò... sau
  // {
  //   id: 'ga-thuong', icon: '🐔', name: 'Gà ta', type: 'ga', buyPrice: 200,
  //   growTime: 600, productId: 'trung', productName: 'Trứng', productIcon: '🥚',
  //   productInterval: 300, productYield: 1, feedCost: 10, sellPrice: 80, xp: 5
  // },
];
function getAnimals() { return DEFAULT_ANIMALS; }
function getAnimal(id) { return DEFAULT_ANIMALS.find(a => a && a.id === id); }

const DEFAULT_COMPANIONS = [
  { id: 'cp-001', icon: '🐶', name: 'Cún', price: 400, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-002', icon: '🐱', name: 'Mèo', price: 435, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-003', icon: '🐭', name: 'Chuột', price: 470, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-004', icon: '🐹', name: 'Hamster', price: 505, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-005', icon: '🐰', name: 'Thỏ', price: 540, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-006', icon: '🦊', name: 'Cáo', price: 575, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-007', icon: '🐻', name: 'Gấu', price: 610, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-008', icon: '🐼', name: 'Panda', price: 645, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-009', icon: '🐨', name: 'Gấu trúc', price: 680, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-010', icon: '🐯', name: 'Hổ', price: 715, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-011', icon: '🦁', name: 'Sư tử', price: 850, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-012', icon: '🐮', name: 'Bò', price: 885, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-013', icon: '🐷', name: 'Heo', price: 920, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-014', icon: '🐸', name: 'Ếch', price: 955, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-015', icon: '🐵', name: 'Khỉ', price: 990, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-016', icon: '🐔', name: 'Gà', price: 1025, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-017', icon: '🐧', name: 'Cánh cụt', price: 1060, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-018', icon: '🐦', name: 'Chim', price: 1095, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-019', icon: '🐤', name: 'Gà con', price: 1130, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-020', icon: '🦆', name: 'Vịt', price: 1165, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-021', icon: '🦅', name: 'Đại bàng', price: 1300, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-022', icon: '🦉', name: 'Cú', price: 1335, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-023', icon: '🦇', name: 'Dơi', price: 1370, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-024', icon: '🐺', name: 'Sói', price: 1405, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-025', icon: '🐗', name: 'Lợn rừng', price: 1440, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-026', icon: '🐴', name: 'Ngựa', price: 1475, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-027', icon: '🦄', name: 'Kỳ lân', price: 1510, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-028', icon: '🐝', name: 'Ong', price: 1545, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-029', icon: '🦋', name: 'Bướm', price: 1580, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-030', icon: '🐌', name: 'Ốc sên', price: 1615, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-031', icon: '🐞', name: 'Bọ rùa', price: 1750, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-032', icon: '🐜', name: 'Kiến', price: 1785, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-033', icon: '🦟', name: 'Muỗi', price: 1820, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-034', icon: '🦗', name: 'Dế', price: 1855, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-035', icon: '🐢', name: 'Rùa', price: 1890, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-036', icon: '🐍', name: 'Rắn', price: 1925, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-037', icon: '🦎', name: 'Thằn lằn', price: 1960, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-038', icon: '🐙', name: 'Bạch tuộc', price: 1995, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-039', icon: '🦑', name: 'Mực', price: 2030, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-040', icon: '🦐', name: 'Tôm', price: 2065, rarity: 'common', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-041', icon: '🦞', name: 'Tôm hùm', price: 2860, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-042', icon: '🦀', name: 'Cua', price: 2905, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-043', icon: '🐡', name: 'Cá nóc', price: 2951, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-044', icon: '🐠', name: 'Cá nhiệt đới', price: 2996, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-045', icon: '🐟', name: 'Cá', price: 3042, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-046', icon: '🐬', name: 'Cá heo', price: 3087, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-047', icon: '🐳', name: 'Cá voi', price: 3133, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-048', icon: '🐋', name: 'Cá voi xanh', price: 3178, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-049', icon: '🦈', name: 'Cá mập', price: 3224, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-050', icon: '🐊', name: 'Cá sấu', price: 3269, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-051', icon: '🐅', name: 'Hổ lớn', price: 3445, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-052', icon: '🐆', name: 'Báo', price: 3490, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-053', icon: '🦓', name: 'Ngựa vằn', price: 3536, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-054', icon: '🦍', name: 'Khỉ đột', price: 3581, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-055', icon: '🦧', name: 'Đười ươi', price: 3627, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-056', icon: '🐘', name: 'Voi', price: 3672, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-057', icon: '🦣', name: 'Voi ma mút', price: 3718, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-058', icon: '🦏', name: 'Tê giác', price: 3763, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-059', icon: '🦛', name: 'Hà mã', price: 3809, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-060', icon: '🐪', name: 'Lạc đà', price: 3854, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-061', icon: '🐫', name: 'Lạc đà 2', price: 4030, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-062', icon: '🦒', name: 'Hươu cao', price: 4075, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-063', icon: '🦘', name: 'Kangaroo', price: 4121, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-064', icon: '🦬', name: 'Bò bison', price: 4166, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-065', icon: '🐃', name: 'Trâu', price: 4212, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-066', icon: '🐂', name: 'Bò đực', price: 4257, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-067', icon: '🐄', name: 'Bò cái', price: 4303, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-068', icon: '🐎', name: 'Ngựa 2', price: 4348, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-069', icon: '🐖', name: 'Heo 2', price: 4394, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-070', icon: '🐏', name: 'Cừu đực', price: 4439, rarity: 'rare', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-071', icon: '🐑', name: 'Cừu', price: 6390, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-072', icon: '🦙', name: 'Lạc đà không bướu', price: 6453, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-073', icon: '🐐', name: 'Dê', price: 6516, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-074', icon: '🦌', name: 'Nai', price: 6579, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-075', icon: '🐕', name: 'Chó', price: 6642, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-076', icon: '🐩', name: 'Poodle', price: 6705, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-077', icon: '🦮', name: 'Chó dẫn', price: 6768, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-078', icon: '🐈', name: 'Mèo 2', price: 6831, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-079', icon: '🐓', name: 'Gà trống', price: 6894, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-080', icon: '🦃', name: 'Gà tây', price: 6957, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-081', icon: '🦤', name: 'Dodo', price: 7200, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-082', icon: '🦚', name: 'Công', price: 7263, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-083', icon: '🦜', name: 'Vẹt', price: 7326, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-084', icon: '🦢', name: 'Thiên nga', price: 7389, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-085', icon: '🦩', name: 'Hồng hạc', price: 7452, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-086', icon: '🕊️', name: 'Bồ câu', price: 7515, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-087', icon: '🐇', name: 'Thỏ 2', price: 7578, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-088', icon: '🦝', name: 'Gấu mèo', price: 7641, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-089', icon: '🦨', name: 'Chồn hôi', price: 7704, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-090', icon: '🦡', name: 'Lửng', price: 7767, rarity: 'epic', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-091', icon: '🦫', name: 'Hải ly', price: 11125, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-092', icon: '🦦', name: 'Rái cá', price: 11212, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-093', icon: '🦥', name: 'Lười', price: 11300, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-094', icon: '🐁', name: 'Chuột nhắt', price: 11387, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-095', icon: '🐀', name: 'Chuột cống', price: 11475, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-096', icon: '🐿️', name: 'Sóc', price: 11562, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-097', icon: '🦔', name: 'Nhím', price: 11650, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-098', icon: '🐲', name: 'Rồng con', price: 11737, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-099', icon: '🌵', name: 'Xương rồng', price: 11825, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' },
  { id: 'cp-100', icon: '⭐', name: 'Sao', price: 11912, rarity: 'legendary', desc: 'Thú cưng ngồi cạnh avatar' }
];
function getCompanions() { return DEFAULT_COMPANIONS; }
function getCompanion(id) { return DEFAULT_COMPANIONS.find(c => c.id === id); }





const _FA_BADGE_SEED = [
  ['address-book', 'Sổ địa chỉ', 320], ['address-card', 'Thẻ địa chỉ', 330],
  ['bell', 'Chuông', 340], ['bookmark', 'Đánh dấu', 350], ['building', 'Tòa nhà', 360],
  ['calendar', 'Lịch', 370], ['calendar-check', 'Lịch check', 380], ['calendar-days', 'Lịch ngày', 390],
  ['chart-bar', 'Biểu đồ', 400], ['chess-bishop', 'Tượng cờ', 410], ['chess-king', 'Vua cờ', 420],
  ['chess-knight', 'Mã cờ', 430], ['chess-pawn', 'Tốt cờ', 440], ['chess-queen', 'Hậu cờ', 450],
  ['chess-rook', 'Xe cờ', 460], ['circle', 'Tròn', 300], ['circle-check', 'Tròn check', 350],
  ['circle-dot', 'Chấm tròn', 320], ['circle-down', 'Tròn xuống', 330], ['circle-left', 'Tròn trái', 330],
  ['circle-pause', 'Tạm dừng', 340], ['circle-play', 'Phát', 350], ['circle-question', 'Hỏi', 360],
  ['circle-right', 'Tròn phải', 330], ['circle-stop', 'Dừng', 340], ['circle-up', 'Tròn lên', 330],
  ['circle-user', 'User tròn', 380], ['circle-xmark', 'Tròn X', 360], ['clipboard', 'Clipboard', 370],
  ['clock', 'Đồng hồ', 380], ['clone', 'Clone', 390], ['closed-captioning', 'Phụ đề', 400],
  ['comment', 'Bình luận', 360], ['comment-dots', 'Chat dots', 370], ['comments', 'Chat nhóm', 380],
  ['compass', 'La bàn', 420], ['copy', 'Copy', 350], ['copyright', 'Bản quyền', 360],
  ['credit-card', 'Thẻ tín dụng', 400], ['envelope', 'Thư', 340], ['envelope-open', 'Thư mở', 360],
  ['eye', 'Mắt', 350], ['eye-slash', 'Che mắt', 360], ['face-angry', 'Tức giận', 380],
  ['face-dizzy', 'Chóng mặt', 390], ['face-flushed', 'Đỏ mặt', 400], ['face-frown', 'Buồn', 380],
  ['face-frown-open', 'Buồn miệng mở', 390], ['face-grimace', 'Nhăn mặt', 400],
  ['face-grin', 'Cười toe', 380], ['face-grin-beam', 'Cười tươi', 400],
  ['face-grin-beam-sweat', 'Cười mồ hôi', 420], ['face-grin-hearts', 'Cười tim', 450],
  ['face-grin-squint', 'Cười nheo', 420], ['face-grin-stars', 'Cười sao', 450],
  ['face-grin-tears', 'Cười khóc', 430], ['face-grin-tongue', 'Cười lưỡi', 420],
  ['face-grin-tongue-squint', 'Cười lưỡi nheo', 440], ['face-grin-tongue-wink', 'Cười lưỡi nháy', 440],
  ['face-grin-wide', 'Cười rộng', 420], ['face-grin-wink', 'Cười nháy', 430],
  ['face-kiss', 'Hôn', 420], ['face-kiss-beam', 'Hôn tươi', 440], ['face-kiss-wink-heart', 'Hôn tim', 480],
  ['face-laugh', 'Cười lớn', 400], ['face-laugh-beam', 'Cười rạng', 420],
  ['face-laugh-squint', 'Cười nheo', 420], ['face-laugh-wink', 'Cười nháy', 430],
  ['face-meh', 'Meh', 360], ['face-meh-blank', 'Meh trống', 370],
  ['face-rolling-eyes', 'Lăn mắt', 400], ['face-sad-cry', 'Khóc buồn', 400],
  ['face-sad-tear', 'Nước mắt', 400], ['face-smile', 'Cười', 360],
  ['face-smile-beam', 'Cười tươi', 400], ['face-smile-wink', 'Cười nháy', 420],
  ['face-surprise', 'Ngạc nhiên', 400], ['face-tired', 'Mệt', 380],
  ['file', 'File', 320], ['file-audio', 'File audio', 360], ['file-code', 'File code', 380],
  ['file-excel', 'File Excel', 400], ['file-image', 'File ảnh', 380], ['file-lines', 'File dòng', 360],
  ['file-pdf', 'File PDF', 400], ['file-powerpoint', 'File PPT', 400], ['file-video', 'File video', 380],
  ['file-word', 'File Word', 400], ['file-zipper', 'File zip', 380],
  ['flag', 'Cờ', 350], ['floppy-disk', 'Đĩa mềm', 360], ['folder', 'Thư mục', 340],
  ['folder-closed', 'Thư mục đóng', 350], ['folder-open', 'Thư mục mở', 360],
  ['font-awesome', 'Font Awesome', 500], ['futbol', 'Bóng đá', 400],
  ['gem', 'Ngọc', 600], ['hand', 'Tay', 350], ['hand-back-fist', 'Nắm đấm', 380],
  ['hand-lizard', 'Tay thằn lằn', 400], ['hand-peace', 'Peace', 400],
  ['hand-point-down', 'Chỉ xuống', 360], ['hand-point-left', 'Chỉ trái', 360],
  ['hand-point-right', 'Chỉ phải', 360], ['hand-point-up', 'Chỉ lên', 360],
  ['hand-pointer', 'Con trỏ', 380], ['hand-scissors', 'Kéo', 380],
  ['hand-spock', 'Spock', 400], ['handshake', 'Bắt tay', 420],
  ['hard-drive', 'Ổ cứng', 380], ['heart', 'Tim', 400], ['hospital', 'Bệnh viện', 420],
  ['hourglass', 'Đồng hồ cát', 400], ['hourglass-half', 'Cát nửa', 420],
  ['id-badge', 'Thẻ ID', 400], ['id-card', 'CMND', 420],
  ['image', 'Ảnh', 360], ['images', 'Nhiều ảnh', 380],
  ['keyboard', 'Bàn phím', 380], ['lemon', 'Chanh', 400],
  ['life-ring', 'Phao', 420], ['lightbulb', 'Bóng đèn', 400],
  ['map', 'Bản đồ', 420], ['message', 'Tin nhắn', 360],
  ['money-bill-1', 'Tiền', 400], ['moon', 'Trăng', 420],
  ['newspaper', 'Báo', 380], ['note-sticky', 'Sticky note', 360],
  ['object-group', 'Nhóm object', 380], ['object-ungroup', 'Tách object', 380],
  ['paper-plane', 'Máy bay giấy', 420], ['paste', 'Dán', 350],
  ['pen-to-square', 'Sửa', 380], ['rectangle-list', 'Danh sách', 360],
  ['rectangle-xmark', 'Hộp X', 360], ['registered', 'Registered', 350],
  ['share-from-square', 'Chia sẻ', 380], ['snowflake', 'Tuyết', 420],
  ['square', 'Vuông', 300], ['square-caret-down', 'Caret xuống', 340],
  ['square-caret-left', 'Caret trái', 340], ['square-caret-right', 'Caret phải', 340],
  ['square-caret-up', 'Caret lên', 340], ['square-check', 'Vuông check', 360],
  ['square-full', 'Vuông đầy', 320], ['square-minus', 'Vuông trừ', 340],
  ['square-plus', 'Vuông cộng', 340], ['star', 'Sao', 450],
  ['sun', 'Mặt trời', 430], ['thumbs-down', 'Dislike', 360],
  ['thumbs-up', 'Like', 360], ['trash-can', 'Thùng rác', 350],
  ['user', 'User', 320], ['window-maximize', 'Cửa sổ max', 360],
  ['window-minimize', 'Cửa sổ min', 360], ['window-restore', 'Khôi phục', 360]
];

const DEFAULT_AVATAR_BADGES = (function () {
  const seen = {};
  const out = [];
  let i = 0;
  _FA_BADGE_SEED.forEach(row => {
    const slug = String(row[0] || '').replace(/^fa-/, '');
    if (!slug || seen[slug]) return;
    seen[slug] = true;
    i++;
    const fa = 'fa-regular fa-' + slug;
    const id = 'ab-' + String(i).padStart(3, '0');
    const name = row[1] || slug;
    const price = Number(row[2]) || 400;
    let rarity = 'common';
    if (price >= 550) rarity = 'legendary';
    else if (price >= 450) rarity = 'epic';
    else if (price >= 380) rarity = 'rare';
    out.push({
      id,
      fa,
      slug,
      name,
      price,
      rarity,
      desc: 'Icon FA regular · ' + slug
    });
  });
  return out;
})();

function getAvatarBadges() { return DEFAULT_AVATAR_BADGES; }
function getAvatarBadge(id) { return DEFAULT_AVATAR_BADGES.find(b => b.id === id); }


const DEFAULT_AVATAR_FRAMES = [
  { id: 'af-emerald', name: 'Ngọc Lục Bảo', price: 500, rarity: 'common', desc: 'Xanh ngọc dịu', gradient: 'linear-gradient(135deg,#10b981,#34d399,#6ee7b7)' },
  { id: 'af-mint', name: 'Bạc Hà', price: 600, rarity: 'common', desc: 'Mint mát lạnh', gradient: 'linear-gradient(135deg,#5eead4,#99f6e4,#ccfbf1)' },
  { id: 'af-sky', name: 'Bầu Trời', price: 700, rarity: 'common', desc: 'Xanh trời trong', gradient: 'linear-gradient(135deg,#0ea5e9,#38bdf8,#7dd3fc)' },
  { id: 'af-ocean', name: 'Đại Dương', price: 900, rarity: 'common', desc: 'Sóng xanh sâu', gradient: 'linear-gradient(135deg,#0369a1,#0ea5e9,#22d3ee)' },
  { id: 'af-lime', name: 'Chanh Vàng', price: 550, rarity: 'common', desc: 'Xanh chanh tươi', gradient: 'linear-gradient(135deg,#65a30d,#a3e635,#bef264)' },
  { id: 'af-leaf', name: 'Lá Non', price: 650, rarity: 'common', desc: 'Xanh lá vườn', gradient: 'linear-gradient(135deg,#15803d,#22c55e,#86efac)' },
  { id: 'af-sand', name: 'Cát Vàng', price: 800, rarity: 'common', desc: 'Cát nắng', gradient: 'linear-gradient(135deg,#ca8a04,#eab308,#fde047)' },
  { id: 'af-coral', name: 'San Hô', price: 850, rarity: 'common', desc: 'Cam san hô', gradient: 'linear-gradient(135deg,#f97316,#fb923c,#fdba74)' },
  { id: 'af-rose', name: 'Hồng Nhẹ', price: 750, rarity: 'common', desc: 'Hồng pastel', gradient: 'linear-gradient(135deg,#fb7185,#fda4af,#fecdd3)' },
  { id: 'af-lavender', name: 'Oải Hương', price: 900, rarity: 'common', desc: 'Tím oải hương', gradient: 'linear-gradient(135deg,#a78bfa,#c4b5fd,#ddd6fe)' },
  { id: 'af-peach', name: 'Đào', price: 700, rarity: 'common', desc: 'Cam đào', gradient: 'linear-gradient(135deg,#fb923c,#fdba74,#fed7aa)' },
  { id: 'af-ice', name: 'Băng Giá', price: 800, rarity: 'common', desc: 'Xanh băng', gradient: 'linear-gradient(135deg,#67e8f9,#a5f3fc,#ecfeff)' },
  { id: 'af-grape', name: 'Nho', price: 1200, rarity: 'rare', desc: 'Tím nho', gradient: 'linear-gradient(135deg,#7c3aed,#a855f7,#c084fc)' },
  { id: 'af-berry', name: 'Dâu Rừng', price: 1300, rarity: 'rare', desc: 'Hồng dâu', gradient: 'linear-gradient(135deg,#be185d,#ec4899,#f9a8d4)' },
  { id: 'af-sunset', name: 'Hoàng Hôn', price: 1500, rarity: 'rare', desc: 'Cam vàng hoàng hôn', gradient: 'linear-gradient(135deg,#ea580c,#f59e0b,#fbbf24)' },
  { id: 'af-dawn', name: 'Bình Minh', price: 1600, rarity: 'rare', desc: 'Hồng cam bình minh', gradient: 'linear-gradient(135deg,#f43f5e,#fb923c,#fbbf24)' },
  { id: 'af-twilight', name: 'Chạng Vạng', price: 1800, rarity: 'rare', desc: 'Tím hoàng hôn', gradient: 'linear-gradient(135deg,#4c1d95,#7c3aed,#c026d3)' },
  { id: 'af-aurora', name: 'Cực Quang', price: 2200, rarity: 'rare', desc: 'Xanh tím cực quang', gradient: 'linear-gradient(135deg,#06b6d4,#22c55e,#a855f7)' },
  { id: 'af-neon', name: 'Neon', price: 2400, rarity: 'rare', desc: 'Neon điện', gradient: 'linear-gradient(135deg,#22d3ee,#e879f9,#f472b6)' },
  { id: 'af-fire', name: 'Ngọn Lửa', price: 2000, rarity: 'rare', desc: 'Đỏ lửa', gradient: 'linear-gradient(135deg,#991b1b,#ef4444,#fbbf24)' },
  { id: 'af-gold', name: 'Hoàng Kim', price: 2800, rarity: 'rare', desc: 'Vàng kim', gradient: 'linear-gradient(135deg,#a16207,#eab308,#fef08a)' },
  { id: 'af-silver', name: 'Bạch Kim', price: 2600, rarity: 'rare', desc: 'Bạc trắng', gradient: 'linear-gradient(135deg,#64748b,#94a3b8,#e2e8f0)' },
  { id: 'af-copper', name: 'Đồng', price: 2100, rarity: 'rare', desc: 'Cam đồng', gradient: 'linear-gradient(135deg,#9a3412,#ea580c,#fdba74)' },
  { id: 'af-jade', name: 'Phỉ Thúy', price: 2500, rarity: 'rare', desc: 'Xanh phỉ thúy', gradient: 'linear-gradient(135deg,#047857,#10b981,#6ee7b7)' },
  { id: 'af-sapphire', name: 'Sapphire', price: 3000, rarity: 'rare', desc: 'Xanh sapphire', gradient: 'linear-gradient(135deg,#1e3a8a,#2563eb,#60a5fa)' },
  { id: 'af-ruby', name: 'Ruby', price: 3200, rarity: 'rare', desc: 'Đỏ ruby', gradient: 'linear-gradient(135deg,#9f1239,#e11d48,#fb7185)' },
  { id: 'af-amethyst', name: 'Thạch Anh Tím', price: 3100, rarity: 'rare', desc: 'Tím thạch anh', gradient: 'linear-gradient(135deg,#5b21b6,#8b5cf6,#c4b5fd)' },
  { id: 'af-topaz', name: 'Topaz', price: 2900, rarity: 'rare', desc: 'Vàng topaz', gradient: 'linear-gradient(135deg,#b45309,#f59e0b,#fde68a)' },
  { id: 'af-opal', name: 'Opal', price: 3500, rarity: 'epic', desc: 'Opal lung linh', gradient: 'linear-gradient(135deg,#67e8f9,#f9a8d4,#fde68a)' },
  { id: 'af-prism', name: 'Lăng Kính', price: 4200, rarity: 'epic', desc: 'Cầu vồng lăng kính', gradient: 'linear-gradient(135deg,#ef4444,#eab308,#22c55e,#3b82f6,#a855f7)' },
  { id: 'af-galaxy', name: 'Thiên Hà', price: 4800, rarity: 'epic', desc: 'Ngân hà', gradient: 'linear-gradient(135deg,#312e81,#7c3aed,#ec4899,#22d3ee)' },
  { id: 'af-nebula', name: 'Tinh Vân', price: 4500, rarity: 'epic', desc: 'Tinh vân hồng', gradient: 'linear-gradient(135deg,#4c1d95,#db2777,#06b6d4)' },
  { id: 'af-comet', name: 'Sao Chổi', price: 4000, rarity: 'epic', desc: 'Vệt sao chổi', gradient: 'linear-gradient(135deg,#0ea5e9,#e0f2fe,#fbbf24)' },
  { id: 'af-void', name: 'Hư Không', price: 3800, rarity: 'epic', desc: 'Đêm hư không', gradient: 'linear-gradient(135deg,#0f172a,#334155,#64748b)' },
  { id: 'af-bloodmoon', name: 'Trăng Máu', price: 4600, rarity: 'epic', desc: 'Trăng đỏ', gradient: 'linear-gradient(135deg,#450a0a,#9f1239,#fb7185)' },
  { id: 'af-frost', name: 'Sương Giá', price: 3600, rarity: 'epic', desc: 'Băng sương', gradient: 'linear-gradient(135deg,#e0f2fe,#7dd3fc,#bae6fd)' },
  { id: 'af-magma', name: 'Nham Thạch', price: 4400, rarity: 'epic', desc: 'Dung nham', gradient: 'linear-gradient(135deg,#7c2d12,#ea580c,#fbbf24)' },
  { id: 'af-forest', name: 'Rừng Thiêng', price: 3700, rarity: 'epic', desc: 'Rừng sâu', gradient: 'linear-gradient(135deg,#14532d,#16a34a,#a3e635)' },
  { id: 'af-sakura', name: 'Anh Đào', price: 3900, rarity: 'epic', desc: 'Hoa anh đào', gradient: 'linear-gradient(135deg,#fb7185,#fecdd3,#fff1f2)' },
  { id: 'af-lotus', name: 'Sen Hồng', price: 4100, rarity: 'epic', desc: 'Sen hồng', gradient: 'linear-gradient(135deg,#db2777,#f9a8d4,#fce7f3)' },
  { id: 'af-rainbow', name: 'Cầu Vồng', price: 5500, rarity: 'epic', desc: 'Cầu vồng đầy đủ', gradient: 'linear-gradient(135deg,#ef4444,#f59e0b,#22c55e,#3b82f6,#a855f7,#ec4899)' },
  { id: 'af-cyber', name: 'Cyberpunk', price: 5200, rarity: 'epic', desc: 'Neon cyber', gradient: 'linear-gradient(135deg,#f0abfc,#22d3ee,#f472b6)' },
  { id: 'af-matrix', name: 'Matrix', price: 5000, rarity: 'epic', desc: 'Mã xanh Matrix', gradient: 'linear-gradient(135deg,#052e16,#22c55e,#86efac)' },
  { id: 'af-royal', name: 'Hoàng Gia', price: 5800, rarity: 'epic', desc: 'Xanh vàng hoàng gia', gradient: 'linear-gradient(135deg,#1e3a8a,#eab308,#fef08a)' },
  { id: 'af-dragon', name: 'Rồng Lửa', price: 6000, rarity: 'epic', desc: 'Rồng lửa', gradient: 'linear-gradient(135deg,#7f1d1d,#f97316,#fde047)' },
  { id: 'af-phoenix', name: 'Phượng Hoàng', price: 6500, rarity: 'legendary', desc: 'Phượng hoàng', gradient: 'linear-gradient(135deg,#9a3412,#f43f5e,#fbbf24)' },
  { id: 'af-unicorn', name: 'Kỳ Lân', price: 7000, rarity: 'legendary', desc: 'Kỳ lân mộng', gradient: 'linear-gradient(135deg,#c4b5fd,#f9a8d4,#67e8f9,#fef08a)' },
  { id: 'af-angel', name: 'Thiên Thần', price: 7200, rarity: 'legendary', desc: 'Ánh thiên thần', gradient: 'linear-gradient(135deg,#fefce8,#fde68a,#e0e7ff)' },
  { id: 'af-demon', name: 'Ác Ma', price: 6800, rarity: 'legendary', desc: 'Bóng ác ma', gradient: 'linear-gradient(135deg,#450a0a,#7f1d1d,#a855f7)' },
  { id: 'af-celestial', name: 'Thiên Thể', price: 8000, rarity: 'legendary', desc: 'Vũ trụ thiên thể', gradient: 'linear-gradient(135deg,#1e1b4b,#6366f1,#e0e7ff,#fbbf24)' },
  { id: 'af-yggdrasil', name: 'Yggdrasil', price: 9000, rarity: 'legendary', desc: 'Cây thế giới', gradient: 'linear-gradient(135deg,#064e3b,#10b981,#f59e0b,#f43f5e)' },
  { id: 'af-divine', name: 'Thần Thánh', price: 9500, rarity: 'legendary', desc: 'Ánh thần thánh', gradient: 'linear-gradient(135deg,#fbbf24,#fef08a,#ffffff,#a5f3fc)' },
  { id: 'af-chaos', name: 'Hỗn Mang', price: 8500, rarity: 'legendary', desc: 'Hỗn mang sắc màu', gradient: 'linear-gradient(135deg,#ef4444,#a855f7,#22d3ee,#f59e0b)' },
  { id: 'af-eternity', name: 'Vĩnh Hằng', price: 10000, rarity: 'legendary', desc: 'Vĩnh hằng', gradient: 'linear-gradient(135deg,#0c4a6e,#7c3aed,#db2777,#fbbf24)' },
  { id: 'af-infinity', name: 'Vô Cực', price: 12000, rarity: 'legendary', desc: 'Vô cực', gradient: 'linear-gradient(135deg,#111827,#6366f1,#ec4899,#22d3ee,#fbbf24)' },
  { id: 'af-mint-glow', name: 'Mint Phát Sáng', price: 1100, rarity: 'rare', desc: 'Mint phát quang', gradient: 'linear-gradient(135deg,#14b8a6,#5eead4,#ccfbf1)' },
  { id: 'af-blue-flame', name: 'Lửa Xanh', price: 2700, rarity: 'rare', desc: 'Ngọn lửa xanh', gradient: 'linear-gradient(135deg,#1d4ed8,#3b82f6,#67e8f9)' },
  { id: 'af-pink-gold', name: 'Hồng Kim', price: 3300, rarity: 'rare', desc: 'Hồng ánh kim', gradient: 'linear-gradient(135deg,#db2777,#f59e0b,#fef08a)' },
  { id: 'af-teal-purple', name: 'Teal Tím', price: 3400, rarity: 'rare', desc: 'Teal pha tím', gradient: 'linear-gradient(135deg,#0f766e,#8b5cf6,#c4b5fd)' },
  { id: 'af-orange-crush', name: 'Cam Ép', price: 1700, rarity: 'rare', desc: 'Cam rực', gradient: 'linear-gradient(135deg,#c2410c,#f97316,#fdba74)' },
  { id: 'af-soft-rainbow', name: 'Cầu Vồng Mềm', price: 4800, rarity: 'epic', desc: 'Cầu vồng pastel', gradient: 'linear-gradient(135deg,#fda4af,#fde68a,#bbf7d0,#bfdbfe,#e9d5ff)' },
  { id: 'af-midnight', name: 'Nửa Đêm', price: 4300, rarity: 'epic', desc: 'Nửa đêm', gradient: 'linear-gradient(135deg,#020617,#1e3a8a,#6366f1)' },
  { id: 'af-candy', name: 'Kẹo Ngọt', price: 4700, rarity: 'epic', desc: 'Kẹo màu', gradient: 'linear-gradient(135deg,#f472b6,#a78bfa,#67e8f9,#fde047)' },
  { id: 'af-steel', name: 'Thép', price: 2400, rarity: 'rare', desc: 'Xám thép', gradient: 'linear-gradient(135deg,#1f2937,#6b7280,#d1d5db)' },
  { id: 'af-bronze', name: 'Đồng Cổ', price: 2300, rarity: 'rare', desc: 'Đồng cổ', gradient: 'linear-gradient(135deg,#78350f,#b45309,#fcd34d)' },
  { id: 'af-emerald-gold', name: 'Lục Kim', price: 5100, rarity: 'epic', desc: 'Ngọc lục + vàng', gradient: 'linear-gradient(135deg,#065f46,#10b981,#fbbf24)' },
  { id: 'af-violet-sky', name: 'Trời Tím', price: 4000, rarity: 'epic', desc: 'Trời tím', gradient: 'linear-gradient(135deg,#4c1d95,#7c3aed,#38bdf8)' },
  { id: 'af-watermelon', name: 'Dưa Hấu', price: 1900, rarity: 'rare', desc: 'Dưa hấu', gradient: 'linear-gradient(135deg,#14532d,#22c55e,#fb7185)' },
  { id: 'af-cotton', name: 'Kẹo Bông', price: 2800, rarity: 'rare', desc: 'Kẹo bông', gradient: 'linear-gradient(135deg,#fce7f3,#e0e7ff,#ecfeff)' },
  { id: 'af-toxic', name: 'Độc Tố', price: 3500, rarity: 'epic', desc: 'Xanh độc', gradient: 'linear-gradient(135deg,#365314,#84cc16,#d9f99d)' },
  { id: 'af-plasma', name: 'Plasma', price: 5600, rarity: 'epic', desc: 'Plasma', gradient: 'linear-gradient(135deg,#db2777,#8b5cf6,#22d3ee)' },
  { id: 'af-solar', name: 'Thái Dương', price: 6200, rarity: 'legendary', desc: 'Thái dương', gradient: 'linear-gradient(135deg,#9a3412,#f59e0b,#fef9c3)' },
  { id: 'af-lunar', name: 'Thái Âm', price: 6100, rarity: 'legendary', desc: 'Ánh trăng', gradient: 'linear-gradient(135deg,#1e293b,#94a3b8,#f8fafc)' },
  { id: 'af-starborn', name: 'Sinh Sao', price: 8800, rarity: 'legendary', desc: 'Sinh ra từ sao', gradient: 'linear-gradient(135deg,#312e81,#f472b6,#fde047,#67e8f9)' },
  { id: 'af-mythic', name: 'Huyền Thoại', price: 11000, rarity: 'legendary', desc: 'Huyền thoại', gradient: 'linear-gradient(135deg,#7c2d12,#a855f7,#22d3ee,#fbbf24)' },
  { id: 'af-gen-001', name: 'Sương Mai', price: 540, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#e27e36,#8ad826,#6bdf70)' },
  { id: 'af-gen-002', name: 'Gió Biển', price: 580, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#e2c636,#26d842,#6bdfc3)' },
  { id: 'af-gen-003', name: 'Mây Hồng', price: 620, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#b5e236,#26d8c3,#6ba8df)' },
  { id: 'af-gen-004', name: 'Trăng Non', price: 660, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#6de236,#266dd8,#826bdf)' },
  { id: 'af-gen-005', name: 'Sao Đêm', price: 700, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#36e247,#26d8b8,#6bafdf)' },
  { id: 'af-gen-006', name: 'Hồ Thu', price: 740, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#36e28f,#2678d8,#7b6bdf)' },
  { id: 'af-gen-007', name: 'Nắng Hạ', price: 780, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#36e2d7,#5426d8,#cf6bdf)' },
  { id: 'af-gen-008', name: 'Mưa Xuân', price: 820, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#36a4e2,#d526d8,#df6b9c)' },
  { id: 'af-gen-009', name: 'Lá Vàng', price: 860, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#365ce2,#d8265b,#df8e6b)' },
  { id: 'af-gen-010', name: 'Tuyết Trắng', price: 900, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#5836e2,#ca26d8,#df6ba3)' },
  { id: 'af-gen-011', name: 'Khói Tím', price: 940, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#a036e2,#d82666,#df876b)' },
  { id: 'af-gen-012', name: 'Nước Mắt', price: 980, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#e236db,#d86626,#dfdb6b)' },
  { id: 'af-gen-013', name: 'Cát Hồng', price: 1020, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#e23693,#cad826,#90df6b)' },
  { id: 'af-gen-014', name: 'Rêu Xanh', price: 1060, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#e2364a,#49d826,#6bdf9a)' },
  { id: 'af-gen-015', name: 'Hạt Ngọc', price: 1100, rarity: 'common', desc: 'Gradient common', gradient: 'linear-gradient(135deg,#e26936,#d5d826,#97df6b)' },
  { id: 'af-gen-016', name: 'Ánh Kim', price: 2300, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#e2b236,#54d826,#6bdf93)' },
  { id: 'af-gen-017', name: 'Bóng Đêm', price: 2350, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#cae236,#26d878,#6bd8df)' },
  { id: 'af-gen-018', name: 'Sóng Lửa', price: 2400, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#81e236,#26b8d8,#6b85df)' },
  { id: 'af-gen-019', name: 'Mắt Mèo', price: 2450, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#39e236,#2638d8,#a56bdf)' },
  { id: 'af-gen-020', name: 'Cánh Bướm', price: 2500, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#36e27b,#26c3d8,#6b8cdf)' },
  { id: 'af-gen-021', name: 'Hoa Cúc', price: 2550, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#36e2c3,#2642d8,#9e6bdf)' },
  { id: 'af-gen-022', name: 'Đom Đóm', price: 2600, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#36b9e2,#8a26d8,#df6bcd)' },
  { id: 'af-gen-023', name: 'Sứa Biển', price: 2650, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#3670e2,#d826a6,#df6b79)' },
  { id: 'af-gen-024', name: 'San Hô Đỏ', price: 2700, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#4336e2,#d82626,#dfb16b)' },
  { id: 'af-gen-025', name: 'Ngọc Trai', price: 2750, rarity: 'rare', desc: 'Gradient rare', gradient: 'linear-gradient(135deg,#8c36e2,#d826b1,#df6b80)' }
];
function getAvatarFrames() { return DEFAULT_AVATAR_FRAMES; }
function getAvatarFrame(id) { return DEFAULT_AVATAR_FRAMES.find(f => f.id === id); }