var Deflate = (function() {
  var MAX_BITS = 15;
  var D_CODES = 30;
  var BL_CODES = 19;
  var LENGTH_CODES = 29;
  var LITERALS = 256;
  var L_CODES = LITERALS + 1 + LENGTH_CODES;
  var HEAP_SIZE = 2 * L_CODES + 1;
  var END_BLOCK = 256;
  var MAX_BL_BITS = 7;
  var REP_3_6 = 16;
  var REPZ_3_10 = 17;
  var REPZ_11_138 = 18;
  var Buf_size = 8 * 2;
  var Z_DEFAULT_COMPRESSION = -1;
  var Z_FILTERED = 1;
  var Z_HUFFMAN_ONLY = 2;
  var Z_DEFAULT_STRATEGY = 0;
  var Z_NO_FLUSH = 0;
  var Z_PARTIAL_FLUSH = 1;
  var Z_FULL_FLUSH = 3;
  var Z_FINISH = 4;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_NEED_DICT = 2;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_BUF_ERROR = -5;
  var _dist_code = [
    0,
    1,
    2,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    6,
    6,
    7,
    7,
    7,
    7,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    8,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    9,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    10,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    11,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    15,
    0,
    0,
    16,
    17,
    18,
    18,
    19,
    19,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    28,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29,
    29
  ];
  function Tree() {
    var that = this;
    function gen_bitlen(s) {
      var tree = that.dyn_tree;
      var stree = that.stat_desc.static_tree;
      var extra = that.stat_desc.extra_bits;
      var base = that.stat_desc.extra_base;
      var max_length = that.stat_desc.max_length;
      var h;
      var n, m;
      var bits;
      var xbits;
      var f;
      var overflow = 0;
      for (bits = 0; bits <= MAX_BITS; bits++)
        s.bl_count[bits] = 0;
      tree[s.heap[s.heap_max] * 2 + 1] = 0;
      for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
        n = s.heap[h];
        bits = tree[tree[n * 2 + 1] * 2 + 1] + 1;
        if (bits > max_length) {
          bits = max_length;
          overflow++;
        }
        tree[n * 2 + 1] = bits;
        if (n > that.max_code)
          continue;
        s.bl_count[bits]++;
        xbits = 0;
        if (n >= base)
          xbits = extra[n - base];
        f = tree[n * 2];
        s.opt_len += f * (bits + xbits);
        if (stree)
          s.static_len += f * (stree[n * 2 + 1] + xbits);
      }
      if (overflow === 0)
        return;
      do {
        bits = max_length - 1;
        while (s.bl_count[bits] === 0)
          bits--;
        s.bl_count[bits]--;
        s.bl_count[bits + 1] += 2;
        s.bl_count[max_length]--;
        overflow -= 2;
      } while (overflow > 0);
      for (bits = max_length; bits !== 0; bits--) {
        n = s.bl_count[bits];
        while (n !== 0) {
          m = s.heap[--h];
          if (m > that.max_code)
            continue;
          if (tree[m * 2 + 1] != bits) {
            s.opt_len += (bits - tree[m * 2 + 1]) * tree[m * 2];
            tree[m * 2 + 1] = bits;
          }
          n--;
        }
      }
    }
    function bi_reverse(code, len) {
      var res = 0;
      do {
        res |= code & 1;
        code >>>= 1;
        res <<= 1;
      } while (--len > 0);
      return res >>> 1;
    }
    function gen_codes(tree, max_code, bl_count) {
      var next_code = [];
      var code = 0;
      var bits;
      var n;
      var len;
      for (bits = 1; bits <= MAX_BITS; bits++) {
        next_code[bits] = code = code + bl_count[bits - 1] << 1;
      }
      for (n = 0; n <= max_code; n++) {
        len = tree[n * 2 + 1];
        if (len === 0)
          continue;
        tree[n * 2] = bi_reverse(next_code[len]++, len);
      }
    }
    that.build_tree = function(s) {
      var tree = that.dyn_tree;
      var stree = that.stat_desc.static_tree;
      var elems = that.stat_desc.elems;
      var n, m;
      var max_code = -1;
      var node;
      s.heap_len = 0;
      s.heap_max = HEAP_SIZE;
      for (n = 0; n < elems; n++) {
        if (tree[n * 2] !== 0) {
          s.heap[++s.heap_len] = max_code = n;
          s.depth[n] = 0;
        } else {
          tree[n * 2 + 1] = 0;
        }
      }
      while (s.heap_len < 2) {
        node = s.heap[++s.heap_len] = max_code < 2 ? ++max_code : 0;
        tree[node * 2] = 1;
        s.depth[node] = 0;
        s.opt_len--;
        if (stree)
          s.static_len -= stree[node * 2 + 1];
      }
      that.max_code = max_code;
      for (n = Math.floor(s.heap_len / 2); n >= 1; n--)
        s.pqdownheap(tree, n);
      node = elems;
      do {
        n = s.heap[1];
        s.heap[1] = s.heap[s.heap_len--];
        s.pqdownheap(tree, 1);
        m = s.heap[1];
        s.heap[--s.heap_max] = n;
        s.heap[--s.heap_max] = m;
        tree[node * 2] = tree[n * 2] + tree[m * 2];
        s.depth[node] = Math.max(s.depth[n], s.depth[m]) + 1;
        tree[n * 2 + 1] = tree[m * 2 + 1] = node;
        s.heap[1] = node++;
        s.pqdownheap(tree, 1);
      } while (s.heap_len >= 2);
      s.heap[--s.heap_max] = s.heap[1];
      gen_bitlen(s);
      gen_codes(tree, that.max_code, s.bl_count);
    };
  }
  Tree._length_code = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    12,
    12,
    13,
    13,
    13,
    13,
    14,
    14,
    14,
    14,
    15,
    15,
    15,
    15,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    16,
    17,
    17,
    17,
    17,
    17,
    17,
    17,
    17,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    18,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    19,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    20,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    21,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    22,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    23,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    24,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    25,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    26,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    27,
    28
  ];
  Tree.base_length = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 0];
  Tree.base_dist = [
    0,
    1,
    2,
    3,
    4,
    6,
    8,
    12,
    16,
    24,
    32,
    48,
    64,
    96,
    128,
    192,
    256,
    384,
    512,
    768,
    1024,
    1536,
    2048,
    3072,
    4096,
    6144,
    8192,
    12288,
    16384,
    24576
  ];
  Tree.d_code = function(dist) {
    return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
  };
  Tree.extra_lbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0];
  Tree.extra_dbits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13];
  Tree.extra_blbits = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 7];
  Tree.bl_order = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15];
  function StaticTree(static_tree, extra_bits, extra_base, elems, max_length) {
    var that = this;
    that.static_tree = static_tree;
    that.extra_bits = extra_bits;
    that.extra_base = extra_base;
    that.elems = elems;
    that.max_length = max_length;
  }
  StaticTree.static_ltree = [
    12,
    8,
    140,
    8,
    76,
    8,
    204,
    8,
    44,
    8,
    172,
    8,
    108,
    8,
    236,
    8,
    28,
    8,
    156,
    8,
    92,
    8,
    220,
    8,
    60,
    8,
    188,
    8,
    124,
    8,
    252,
    8,
    2,
    8,
    130,
    8,
    66,
    8,
    194,
    8,
    34,
    8,
    162,
    8,
    98,
    8,
    226,
    8,
    18,
    8,
    146,
    8,
    82,
    8,
    210,
    8,
    50,
    8,
    178,
    8,
    114,
    8,
    242,
    8,
    10,
    8,
    138,
    8,
    74,
    8,
    202,
    8,
    42,
    8,
    170,
    8,
    106,
    8,
    234,
    8,
    26,
    8,
    154,
    8,
    90,
    8,
    218,
    8,
    58,
    8,
    186,
    8,
    122,
    8,
    250,
    8,
    6,
    8,
    134,
    8,
    70,
    8,
    198,
    8,
    38,
    8,
    166,
    8,
    102,
    8,
    230,
    8,
    22,
    8,
    150,
    8,
    86,
    8,
    214,
    8,
    54,
    8,
    182,
    8,
    118,
    8,
    246,
    8,
    14,
    8,
    142,
    8,
    78,
    8,
    206,
    8,
    46,
    8,
    174,
    8,
    110,
    8,
    238,
    8,
    30,
    8,
    158,
    8,
    94,
    8,
    222,
    8,
    62,
    8,
    190,
    8,
    126,
    8,
    254,
    8,
    1,
    8,
    129,
    8,
    65,
    8,
    193,
    8,
    33,
    8,
    161,
    8,
    97,
    8,
    225,
    8,
    17,
    8,
    145,
    8,
    81,
    8,
    209,
    8,
    49,
    8,
    177,
    8,
    113,
    8,
    241,
    8,
    9,
    8,
    137,
    8,
    73,
    8,
    201,
    8,
    41,
    8,
    169,
    8,
    105,
    8,
    233,
    8,
    25,
    8,
    153,
    8,
    89,
    8,
    217,
    8,
    57,
    8,
    185,
    8,
    121,
    8,
    249,
    8,
    5,
    8,
    133,
    8,
    69,
    8,
    197,
    8,
    37,
    8,
    165,
    8,
    101,
    8,
    229,
    8,
    21,
    8,
    149,
    8,
    85,
    8,
    213,
    8,
    53,
    8,
    181,
    8,
    117,
    8,
    245,
    8,
    13,
    8,
    141,
    8,
    77,
    8,
    205,
    8,
    45,
    8,
    173,
    8,
    109,
    8,
    237,
    8,
    29,
    8,
    157,
    8,
    93,
    8,
    221,
    8,
    61,
    8,
    189,
    8,
    125,
    8,
    253,
    8,
    19,
    9,
    275,
    9,
    147,
    9,
    403,
    9,
    83,
    9,
    339,
    9,
    211,
    9,
    467,
    9,
    51,
    9,
    307,
    9,
    179,
    9,
    435,
    9,
    115,
    9,
    371,
    9,
    243,
    9,
    499,
    9,
    11,
    9,
    267,
    9,
    139,
    9,
    395,
    9,
    75,
    9,
    331,
    9,
    203,
    9,
    459,
    9,
    43,
    9,
    299,
    9,
    171,
    9,
    427,
    9,
    107,
    9,
    363,
    9,
    235,
    9,
    491,
    9,
    27,
    9,
    283,
    9,
    155,
    9,
    411,
    9,
    91,
    9,
    347,
    9,
    219,
    9,
    475,
    9,
    59,
    9,
    315,
    9,
    187,
    9,
    443,
    9,
    123,
    9,
    379,
    9,
    251,
    9,
    507,
    9,
    7,
    9,
    263,
    9,
    135,
    9,
    391,
    9,
    71,
    9,
    327,
    9,
    199,
    9,
    455,
    9,
    39,
    9,
    295,
    9,
    167,
    9,
    423,
    9,
    103,
    9,
    359,
    9,
    231,
    9,
    487,
    9,
    23,
    9,
    279,
    9,
    151,
    9,
    407,
    9,
    87,
    9,
    343,
    9,
    215,
    9,
    471,
    9,
    55,
    9,
    311,
    9,
    183,
    9,
    439,
    9,
    119,
    9,
    375,
    9,
    247,
    9,
    503,
    9,
    15,
    9,
    271,
    9,
    143,
    9,
    399,
    9,
    79,
    9,
    335,
    9,
    207,
    9,
    463,
    9,
    47,
    9,
    303,
    9,
    175,
    9,
    431,
    9,
    111,
    9,
    367,
    9,
    239,
    9,
    495,
    9,
    31,
    9,
    287,
    9,
    159,
    9,
    415,
    9,
    95,
    9,
    351,
    9,
    223,
    9,
    479,
    9,
    63,
    9,
    319,
    9,
    191,
    9,
    447,
    9,
    127,
    9,
    383,
    9,
    255,
    9,
    511,
    9,
    0,
    7,
    64,
    7,
    32,
    7,
    96,
    7,
    16,
    7,
    80,
    7,
    48,
    7,
    112,
    7,
    8,
    7,
    72,
    7,
    40,
    7,
    104,
    7,
    24,
    7,
    88,
    7,
    56,
    7,
    120,
    7,
    4,
    7,
    68,
    7,
    36,
    7,
    100,
    7,
    20,
    7,
    84,
    7,
    52,
    7,
    116,
    7,
    3,
    8,
    131,
    8,
    67,
    8,
    195,
    8,
    35,
    8,
    163,
    8,
    99,
    8,
    227,
    8
  ];
  StaticTree.static_dtree = [
    0,
    5,
    16,
    5,
    8,
    5,
    24,
    5,
    4,
    5,
    20,
    5,
    12,
    5,
    28,
    5,
    2,
    5,
    18,
    5,
    10,
    5,
    26,
    5,
    6,
    5,
    22,
    5,
    14,
    5,
    30,
    5,
    1,
    5,
    17,
    5,
    9,
    5,
    25,
    5,
    5,
    5,
    21,
    5,
    13,
    5,
    29,
    5,
    3,
    5,
    19,
    5,
    11,
    5,
    27,
    5,
    7,
    5,
    23,
    5
  ];
  StaticTree.static_l_desc = new StaticTree(StaticTree.static_ltree, Tree.extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
  StaticTree.static_d_desc = new StaticTree(StaticTree.static_dtree, Tree.extra_dbits, 0, D_CODES, MAX_BITS);
  StaticTree.static_bl_desc = new StaticTree(null, Tree.extra_blbits, 0, BL_CODES, MAX_BL_BITS);
  var MAX_MEM_LEVEL = 9;
  var DEF_MEM_LEVEL = 8;
  function Config(good_length, max_lazy, nice_length, max_chain, func) {
    var that = this;
    that.good_length = good_length;
    that.max_lazy = max_lazy;
    that.nice_length = nice_length;
    that.max_chain = max_chain;
    that.func = func;
  }
  var STORED = 0;
  var FAST = 1;
  var SLOW = 2;
  var config_table = [
    new Config(0, 0, 0, 0, STORED),
    new Config(4, 4, 8, 4, FAST),
    new Config(4, 5, 16, 8, FAST),
    new Config(4, 6, 32, 32, FAST),
    new Config(4, 4, 16, 16, SLOW),
    new Config(8, 16, 32, 32, SLOW),
    new Config(8, 16, 128, 128, SLOW),
    new Config(8, 32, 128, 256, SLOW),
    new Config(32, 128, 258, 1024, SLOW),
    new Config(32, 258, 258, 4096, SLOW)
  ];
  var z_errmsg = [
    "need dictionary",
    // Z_NEED_DICT
    // 2
    "stream end",
    // Z_STREAM_END 1
    "",
    // Z_OK 0
    "",
    // Z_ERRNO (-1)
    "stream error",
    // Z_STREAM_ERROR (-2)
    "data error",
    // Z_DATA_ERROR (-3)
    "",
    // Z_MEM_ERROR (-4)
    "buffer error",
    // Z_BUF_ERROR (-5)
    "",
    // Z_VERSION_ERROR (-6)
    ""
  ];
  var NeedMore = 0;
  var BlockDone = 1;
  var FinishStarted = 2;
  var FinishDone = 3;
  var PRESET_DICT = 32;
  var INIT_STATE = 42;
  var BUSY_STATE = 113;
  var FINISH_STATE = 666;
  var Z_DEFLATED = 8;
  var STORED_BLOCK = 0;
  var STATIC_TREES = 1;
  var DYN_TREES = 2;
  var MIN_MATCH = 3;
  var MAX_MATCH = 258;
  var MIN_LOOKAHEAD = MAX_MATCH + MIN_MATCH + 1;
  function smaller(tree, n, m, depth) {
    var tn2 = tree[n * 2];
    var tm2 = tree[m * 2];
    return tn2 < tm2 || tn2 == tm2 && depth[n] <= depth[m];
  }
  function Deflate2() {
    var that = this;
    var strm;
    var status;
    var pending_buf_size;
    var last_flush;
    var w_size;
    var w_bits;
    var w_mask;
    var window;
    var window_size;
    var prev;
    var head;
    var ins_h;
    var hash_size;
    var hash_bits;
    var hash_mask;
    var hash_shift;
    var block_start;
    var match_length;
    var prev_match;
    var match_available;
    var strstart;
    var match_start;
    var lookahead;
    var prev_length;
    var max_chain_length;
    var max_lazy_match;
    var level;
    var strategy;
    var good_match;
    var nice_match;
    var dyn_ltree;
    var dyn_dtree;
    var bl_tree;
    var l_desc = new Tree();
    var d_desc = new Tree();
    var bl_desc = new Tree();
    that.depth = [];
    var l_buf;
    var lit_bufsize;
    var last_lit;
    var d_buf;
    var matches;
    var last_eob_len;
    var bi_buf;
    var bi_valid;
    that.bl_count = [];
    that.heap = [];
    dyn_ltree = [];
    dyn_dtree = [];
    bl_tree = [];
    function lm_init() {
      var i;
      window_size = 2 * w_size;
      head[hash_size - 1] = 0;
      for (i = 0; i < hash_size - 1; i++) {
        head[i] = 0;
      }
      max_lazy_match = config_table[level].max_lazy;
      good_match = config_table[level].good_length;
      nice_match = config_table[level].nice_length;
      max_chain_length = config_table[level].max_chain;
      strstart = 0;
      block_start = 0;
      lookahead = 0;
      match_length = prev_length = MIN_MATCH - 1;
      match_available = 0;
      ins_h = 0;
    }
    function init_block() {
      var i;
      for (i = 0; i < L_CODES; i++)
        dyn_ltree[i * 2] = 0;
      for (i = 0; i < D_CODES; i++)
        dyn_dtree[i * 2] = 0;
      for (i = 0; i < BL_CODES; i++)
        bl_tree[i * 2] = 0;
      dyn_ltree[END_BLOCK * 2] = 1;
      that.opt_len = that.static_len = 0;
      last_lit = matches = 0;
    }
    function tr_init() {
      l_desc.dyn_tree = dyn_ltree;
      l_desc.stat_desc = StaticTree.static_l_desc;
      d_desc.dyn_tree = dyn_dtree;
      d_desc.stat_desc = StaticTree.static_d_desc;
      bl_desc.dyn_tree = bl_tree;
      bl_desc.stat_desc = StaticTree.static_bl_desc;
      bi_buf = 0;
      bi_valid = 0;
      last_eob_len = 8;
      init_block();
    }
    that.pqdownheap = function(tree, k) {
      var heap = that.heap;
      var v = heap[k];
      var j = k << 1;
      while (j <= that.heap_len) {
        if (j < that.heap_len && smaller(tree, heap[j + 1], heap[j], that.depth)) {
          j++;
        }
        if (smaller(tree, v, heap[j], that.depth))
          break;
        heap[k] = heap[j];
        k = j;
        j <<= 1;
      }
      heap[k] = v;
    };
    function scan_tree(tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      tree[(max_code + 1) * 2 + 1] = 65535;
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen == nextlen) {
          continue;
        } else if (count < min_count) {
          bl_tree[curlen * 2] += count;
        } else if (curlen !== 0) {
          if (curlen != prevlen)
            bl_tree[curlen * 2]++;
          bl_tree[REP_3_6 * 2]++;
        } else if (count <= 10) {
          bl_tree[REPZ_3_10 * 2]++;
        } else {
          bl_tree[REPZ_11_138 * 2]++;
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen == nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function build_bl_tree() {
      var max_blindex;
      scan_tree(dyn_ltree, l_desc.max_code);
      scan_tree(dyn_dtree, d_desc.max_code);
      bl_desc.build_tree(that);
      for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
        if (bl_tree[Tree.bl_order[max_blindex] * 2 + 1] !== 0)
          break;
      }
      that.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
      return max_blindex;
    }
    function put_byte(p) {
      that.pending_buf[that.pending++] = p;
    }
    function put_short(w) {
      put_byte(w & 255);
      put_byte(w >>> 8 & 255);
    }
    function putShortMSB(b) {
      put_byte(b >> 8 & 255);
      put_byte(b & 255 & 255);
    }
    function send_bits(value, length) {
      var val, len = length;
      if (bi_valid > Buf_size - len) {
        val = value;
        bi_buf |= val << bi_valid & 65535;
        put_short(bi_buf);
        bi_buf = val >>> Buf_size - bi_valid;
        bi_valid += len - Buf_size;
      } else {
        bi_buf |= value << bi_valid & 65535;
        bi_valid += len;
      }
    }
    function send_code(c, tree) {
      var c2 = c * 2;
      send_bits(tree[c2] & 65535, tree[c2 + 1] & 65535);
    }
    function send_tree(tree, max_code) {
      var n;
      var prevlen = -1;
      var curlen;
      var nextlen = tree[0 * 2 + 1];
      var count = 0;
      var max_count = 7;
      var min_count = 4;
      if (nextlen === 0) {
        max_count = 138;
        min_count = 3;
      }
      for (n = 0; n <= max_code; n++) {
        curlen = nextlen;
        nextlen = tree[(n + 1) * 2 + 1];
        if (++count < max_count && curlen == nextlen) {
          continue;
        } else if (count < min_count) {
          do {
            send_code(curlen, bl_tree);
          } while (--count !== 0);
        } else if (curlen !== 0) {
          if (curlen != prevlen) {
            send_code(curlen, bl_tree);
            count--;
          }
          send_code(REP_3_6, bl_tree);
          send_bits(count - 3, 2);
        } else if (count <= 10) {
          send_code(REPZ_3_10, bl_tree);
          send_bits(count - 3, 3);
        } else {
          send_code(REPZ_11_138, bl_tree);
          send_bits(count - 11, 7);
        }
        count = 0;
        prevlen = curlen;
        if (nextlen === 0) {
          max_count = 138;
          min_count = 3;
        } else if (curlen == nextlen) {
          max_count = 6;
          min_count = 3;
        } else {
          max_count = 7;
          min_count = 4;
        }
      }
    }
    function send_all_trees(lcodes, dcodes, blcodes) {
      var rank;
      send_bits(lcodes - 257, 5);
      send_bits(dcodes - 1, 5);
      send_bits(blcodes - 4, 4);
      for (rank = 0; rank < blcodes; rank++) {
        send_bits(bl_tree[Tree.bl_order[rank] * 2 + 1], 3);
      }
      send_tree(dyn_ltree, lcodes - 1);
      send_tree(dyn_dtree, dcodes - 1);
    }
    function bi_flush() {
      if (bi_valid == 16) {
        put_short(bi_buf);
        bi_buf = 0;
        bi_valid = 0;
      } else if (bi_valid >= 8) {
        put_byte(bi_buf & 255);
        bi_buf >>>= 8;
        bi_valid -= 8;
      }
    }
    function _tr_align() {
      send_bits(STATIC_TREES << 1, 3);
      send_code(END_BLOCK, StaticTree.static_ltree);
      bi_flush();
      if (1 + last_eob_len + 10 - bi_valid < 9) {
        send_bits(STATIC_TREES << 1, 3);
        send_code(END_BLOCK, StaticTree.static_ltree);
        bi_flush();
      }
      last_eob_len = 7;
    }
    function _tr_tally(dist, lc) {
      var out_length, in_length, dcode;
      that.pending_buf[d_buf + last_lit * 2] = dist >>> 8 & 255;
      that.pending_buf[d_buf + last_lit * 2 + 1] = dist & 255;
      that.pending_buf[l_buf + last_lit] = lc & 255;
      last_lit++;
      if (dist === 0) {
        dyn_ltree[lc * 2]++;
      } else {
        matches++;
        dist--;
        dyn_ltree[(Tree._length_code[lc] + LITERALS + 1) * 2]++;
        dyn_dtree[Tree.d_code(dist) * 2]++;
      }
      if ((last_lit & 8191) === 0 && level > 2) {
        out_length = last_lit * 8;
        in_length = strstart - block_start;
        for (dcode = 0; dcode < D_CODES; dcode++) {
          out_length += dyn_dtree[dcode * 2] * (5 + Tree.extra_dbits[dcode]);
        }
        out_length >>>= 3;
        if (matches < Math.floor(last_lit / 2) && out_length < Math.floor(in_length / 2))
          return true;
      }
      return last_lit == lit_bufsize - 1;
    }
    function compress_block(ltree, dtree) {
      var dist;
      var lc;
      var lx = 0;
      var code;
      var extra;
      if (last_lit !== 0) {
        do {
          dist = that.pending_buf[d_buf + lx * 2] << 8 & 65280 | that.pending_buf[d_buf + lx * 2 + 1] & 255;
          lc = that.pending_buf[l_buf + lx] & 255;
          lx++;
          if (dist === 0) {
            send_code(lc, ltree);
          } else {
            code = Tree._length_code[lc];
            send_code(code + LITERALS + 1, ltree);
            extra = Tree.extra_lbits[code];
            if (extra !== 0) {
              lc -= Tree.base_length[code];
              send_bits(lc, extra);
            }
            dist--;
            code = Tree.d_code(dist);
            send_code(code, dtree);
            extra = Tree.extra_dbits[code];
            if (extra !== 0) {
              dist -= Tree.base_dist[code];
              send_bits(dist, extra);
            }
          }
        } while (lx < last_lit);
      }
      send_code(END_BLOCK, ltree);
      last_eob_len = ltree[END_BLOCK * 2 + 1];
    }
    function bi_windup() {
      if (bi_valid > 8) {
        put_short(bi_buf);
      } else if (bi_valid > 0) {
        put_byte(bi_buf & 255);
      }
      bi_buf = 0;
      bi_valid = 0;
    }
    function copy_block(buf, len, header) {
      bi_windup();
      last_eob_len = 8;
      {
        put_short(len);
        put_short(~len);
      }
      that.pending_buf.set(window.subarray(buf, buf + len), that.pending);
      that.pending += len;
    }
    function _tr_stored_block(buf, stored_len, eof) {
      send_bits((STORED_BLOCK << 1) + (eof ? 1 : 0), 3);
      copy_block(buf, stored_len);
    }
    function _tr_flush_block(buf, stored_len, eof) {
      var opt_lenb, static_lenb;
      var max_blindex = 0;
      if (level > 0) {
        l_desc.build_tree(that);
        d_desc.build_tree(that);
        max_blindex = build_bl_tree();
        opt_lenb = that.opt_len + 3 + 7 >>> 3;
        static_lenb = that.static_len + 3 + 7 >>> 3;
        if (static_lenb <= opt_lenb)
          opt_lenb = static_lenb;
      } else {
        opt_lenb = static_lenb = stored_len + 5;
      }
      if (stored_len + 4 <= opt_lenb && buf != -1) {
        _tr_stored_block(buf, stored_len, eof);
      } else if (static_lenb == opt_lenb) {
        send_bits((STATIC_TREES << 1) + (eof ? 1 : 0), 3);
        compress_block(StaticTree.static_ltree, StaticTree.static_dtree);
      } else {
        send_bits((DYN_TREES << 1) + (eof ? 1 : 0), 3);
        send_all_trees(l_desc.max_code + 1, d_desc.max_code + 1, max_blindex + 1);
        compress_block(dyn_ltree, dyn_dtree);
      }
      init_block();
      if (eof) {
        bi_windup();
      }
    }
    function flush_block_only(eof) {
      _tr_flush_block(block_start >= 0 ? block_start : -1, strstart - block_start, eof);
      block_start = strstart;
      strm.flush_pending();
    }
    function fill_window() {
      var n, m;
      var p;
      var more;
      do {
        more = window_size - lookahead - strstart;
        if (more === 0 && strstart === 0 && lookahead === 0) {
          more = w_size;
        } else if (more == -1) {
          more--;
        } else if (strstart >= w_size + w_size - MIN_LOOKAHEAD) {
          window.set(window.subarray(w_size, w_size + w_size), 0);
          match_start -= w_size;
          strstart -= w_size;
          block_start -= w_size;
          n = hash_size;
          p = n;
          do {
            m = head[--p] & 65535;
            head[p] = m >= w_size ? m - w_size : 0;
          } while (--n !== 0);
          n = w_size;
          p = n;
          do {
            m = prev[--p] & 65535;
            prev[p] = m >= w_size ? m - w_size : 0;
          } while (--n !== 0);
          more += w_size;
        }
        if (strm.avail_in === 0)
          return;
        n = strm.read_buf(window, strstart + lookahead, more);
        lookahead += n;
        if (lookahead >= MIN_MATCH) {
          ins_h = window[strstart] & 255;
          ins_h = (ins_h << hash_shift ^ window[strstart + 1] & 255) & hash_mask;
        }
      } while (lookahead < MIN_LOOKAHEAD && strm.avail_in !== 0);
    }
    function deflate_stored(flush) {
      var max_block_size = 65535;
      var max_start;
      if (max_block_size > pending_buf_size - 5) {
        max_block_size = pending_buf_size - 5;
      }
      while (true) {
        if (lookahead <= 1) {
          fill_window();
          if (lookahead === 0 && flush == Z_NO_FLUSH)
            return NeedMore;
          if (lookahead === 0)
            break;
        }
        strstart += lookahead;
        lookahead = 0;
        max_start = block_start + max_block_size;
        if (strstart === 0 || strstart >= max_start) {
          lookahead = strstart - max_start;
          strstart = max_start;
          flush_block_only(false);
          if (strm.avail_out === 0)
            return NeedMore;
        }
        if (strstart - block_start >= w_size - MIN_LOOKAHEAD) {
          flush_block_only(false);
          if (strm.avail_out === 0)
            return NeedMore;
        }
      }
      flush_block_only(flush == Z_FINISH);
      if (strm.avail_out === 0)
        return flush == Z_FINISH ? FinishStarted : NeedMore;
      return flush == Z_FINISH ? FinishDone : BlockDone;
    }
    function longest_match(cur_match) {
      var chain_length = max_chain_length;
      var scan = strstart;
      var match;
      var len;
      var best_len = prev_length;
      var limit = strstart > w_size - MIN_LOOKAHEAD ? strstart - (w_size - MIN_LOOKAHEAD) : 0;
      var _nice_match = nice_match;
      var wmask = w_mask;
      var strend = strstart + MAX_MATCH;
      var scan_end1 = window[scan + best_len - 1];
      var scan_end = window[scan + best_len];
      if (prev_length >= good_match) {
        chain_length >>= 2;
      }
      if (_nice_match > lookahead)
        _nice_match = lookahead;
      do {
        match = cur_match;
        if (window[match + best_len] != scan_end || window[match + best_len - 1] != scan_end1 || window[match] != window[scan] || window[++match] != window[scan + 1])
          continue;
        scan += 2;
        match++;
        do {
        } while (window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && window[++scan] == window[++match] && scan < strend);
        len = MAX_MATCH - (strend - scan);
        scan = strend - MAX_MATCH;
        if (len > best_len) {
          match_start = cur_match;
          best_len = len;
          if (len >= _nice_match)
            break;
          scan_end1 = window[scan + best_len - 1];
          scan_end = window[scan + best_len];
        }
      } while ((cur_match = prev[cur_match & wmask] & 65535) > limit && --chain_length !== 0);
      if (best_len <= lookahead)
        return best_len;
      return lookahead;
    }
    function deflate_fast(flush) {
      var hash_head = 0;
      var bflush;
      while (true) {
        if (lookahead < MIN_LOOKAHEAD) {
          fill_window();
          if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
            return NeedMore;
          }
          if (lookahead === 0)
            break;
        }
        if (lookahead >= MIN_MATCH) {
          ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 255) & hash_mask;
          hash_head = head[ins_h] & 65535;
          prev[strstart & w_mask] = head[ins_h];
          head[ins_h] = strstart;
        }
        if (hash_head !== 0 && (strstart - hash_head & 65535) <= w_size - MIN_LOOKAHEAD) {
          if (strategy != Z_HUFFMAN_ONLY) {
            match_length = longest_match(hash_head);
          }
        }
        if (match_length >= MIN_MATCH) {
          bflush = _tr_tally(strstart - match_start, match_length - MIN_MATCH);
          lookahead -= match_length;
          if (match_length <= max_lazy_match && lookahead >= MIN_MATCH) {
            match_length--;
            do {
              strstart++;
              ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 255) & hash_mask;
              hash_head = head[ins_h] & 65535;
              prev[strstart & w_mask] = head[ins_h];
              head[ins_h] = strstart;
            } while (--match_length !== 0);
            strstart++;
          } else {
            strstart += match_length;
            match_length = 0;
            ins_h = window[strstart] & 255;
            ins_h = (ins_h << hash_shift ^ window[strstart + 1] & 255) & hash_mask;
          }
        } else {
          bflush = _tr_tally(0, window[strstart] & 255);
          lookahead--;
          strstart++;
        }
        if (bflush) {
          flush_block_only(false);
          if (strm.avail_out === 0)
            return NeedMore;
        }
      }
      flush_block_only(flush == Z_FINISH);
      if (strm.avail_out === 0) {
        if (flush == Z_FINISH)
          return FinishStarted;
        else
          return NeedMore;
      }
      return flush == Z_FINISH ? FinishDone : BlockDone;
    }
    function deflate_slow(flush) {
      var hash_head = 0;
      var bflush;
      var max_insert;
      while (true) {
        if (lookahead < MIN_LOOKAHEAD) {
          fill_window();
          if (lookahead < MIN_LOOKAHEAD && flush == Z_NO_FLUSH) {
            return NeedMore;
          }
          if (lookahead === 0)
            break;
        }
        if (lookahead >= MIN_MATCH) {
          ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 255) & hash_mask;
          hash_head = head[ins_h] & 65535;
          prev[strstart & w_mask] = head[ins_h];
          head[ins_h] = strstart;
        }
        prev_length = match_length;
        prev_match = match_start;
        match_length = MIN_MATCH - 1;
        if (hash_head !== 0 && prev_length < max_lazy_match && (strstart - hash_head & 65535) <= w_size - MIN_LOOKAHEAD) {
          if (strategy != Z_HUFFMAN_ONLY) {
            match_length = longest_match(hash_head);
          }
          if (match_length <= 5 && (strategy == Z_FILTERED || match_length == MIN_MATCH && strstart - match_start > 4096)) {
            match_length = MIN_MATCH - 1;
          }
        }
        if (prev_length >= MIN_MATCH && match_length <= prev_length) {
          max_insert = strstart + lookahead - MIN_MATCH;
          bflush = _tr_tally(strstart - 1 - prev_match, prev_length - MIN_MATCH);
          lookahead -= prev_length - 1;
          prev_length -= 2;
          do {
            if (++strstart <= max_insert) {
              ins_h = (ins_h << hash_shift ^ window[strstart + (MIN_MATCH - 1)] & 255) & hash_mask;
              hash_head = head[ins_h] & 65535;
              prev[strstart & w_mask] = head[ins_h];
              head[ins_h] = strstart;
            }
          } while (--prev_length !== 0);
          match_available = 0;
          match_length = MIN_MATCH - 1;
          strstart++;
          if (bflush) {
            flush_block_only(false);
            if (strm.avail_out === 0)
              return NeedMore;
          }
        } else if (match_available !== 0) {
          bflush = _tr_tally(0, window[strstart - 1] & 255);
          if (bflush) {
            flush_block_only(false);
          }
          strstart++;
          lookahead--;
          if (strm.avail_out === 0)
            return NeedMore;
        } else {
          match_available = 1;
          strstart++;
          lookahead--;
        }
      }
      if (match_available !== 0) {
        bflush = _tr_tally(0, window[strstart - 1] & 255);
        match_available = 0;
      }
      flush_block_only(flush == Z_FINISH);
      if (strm.avail_out === 0) {
        if (flush == Z_FINISH)
          return FinishStarted;
        else
          return NeedMore;
      }
      return flush == Z_FINISH ? FinishDone : BlockDone;
    }
    function deflateReset(strm2) {
      strm2.total_in = strm2.total_out = 0;
      strm2.msg = null;
      that.pending = 0;
      that.pending_out = 0;
      status = BUSY_STATE;
      last_flush = Z_NO_FLUSH;
      tr_init();
      lm_init();
      return Z_OK;
    }
    that.deflateInit = function(strm2, _level, bits, _method, memLevel, _strategy) {
      if (!_method)
        _method = Z_DEFLATED;
      if (!memLevel)
        memLevel = DEF_MEM_LEVEL;
      if (!_strategy)
        _strategy = Z_DEFAULT_STRATEGY;
      strm2.msg = null;
      if (_level == Z_DEFAULT_COMPRESSION)
        _level = 6;
      if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || _method != Z_DEFLATED || bits < 9 || bits > 15 || _level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
        return Z_STREAM_ERROR;
      }
      strm2.dstate = that;
      w_bits = bits;
      w_size = 1 << w_bits;
      w_mask = w_size - 1;
      hash_bits = memLevel + 7;
      hash_size = 1 << hash_bits;
      hash_mask = hash_size - 1;
      hash_shift = Math.floor((hash_bits + MIN_MATCH - 1) / MIN_MATCH);
      window = new Uint8Array(w_size * 2);
      prev = [];
      head = [];
      lit_bufsize = 1 << memLevel + 6;
      that.pending_buf = new Uint8Array(lit_bufsize * 4);
      pending_buf_size = lit_bufsize * 4;
      d_buf = Math.floor(lit_bufsize / 2);
      l_buf = (1 + 2) * lit_bufsize;
      level = _level;
      strategy = _strategy;
      return deflateReset(strm2);
    };
    that.deflateEnd = function() {
      if (status != INIT_STATE && status != BUSY_STATE && status != FINISH_STATE) {
        return Z_STREAM_ERROR;
      }
      that.pending_buf = null;
      head = null;
      prev = null;
      window = null;
      that.dstate = null;
      return status == BUSY_STATE ? Z_DATA_ERROR : Z_OK;
    };
    that.deflateParams = function(strm2, _level, _strategy) {
      var err = Z_OK;
      if (_level == Z_DEFAULT_COMPRESSION) {
        _level = 6;
      }
      if (_level < 0 || _level > 9 || _strategy < 0 || _strategy > Z_HUFFMAN_ONLY) {
        return Z_STREAM_ERROR;
      }
      if (config_table[level].func != config_table[_level].func && strm2.total_in !== 0) {
        err = strm2.deflate(Z_PARTIAL_FLUSH);
      }
      if (level != _level) {
        level = _level;
        max_lazy_match = config_table[level].max_lazy;
        good_match = config_table[level].good_length;
        nice_match = config_table[level].nice_length;
        max_chain_length = config_table[level].max_chain;
      }
      strategy = _strategy;
      return err;
    };
    that.deflateSetDictionary = function(strm2, dictionary, dictLength) {
      var length = dictLength;
      var n, index = 0;
      if (!dictionary || status != INIT_STATE)
        return Z_STREAM_ERROR;
      if (length < MIN_MATCH)
        return Z_OK;
      if (length > w_size - MIN_LOOKAHEAD) {
        length = w_size - MIN_LOOKAHEAD;
        index = dictLength - length;
      }
      window.set(dictionary.subarray(index, index + length), 0);
      strstart = length;
      block_start = length;
      ins_h = window[0] & 255;
      ins_h = (ins_h << hash_shift ^ window[1] & 255) & hash_mask;
      for (n = 0; n <= length - MIN_MATCH; n++) {
        ins_h = (ins_h << hash_shift ^ window[n + (MIN_MATCH - 1)] & 255) & hash_mask;
        prev[n & w_mask] = head[ins_h];
        head[ins_h] = n;
      }
      return Z_OK;
    };
    that.deflate = function(_strm, flush) {
      var i, header, level_flags, old_flush, bstate;
      if (flush > Z_FINISH || flush < 0) {
        return Z_STREAM_ERROR;
      }
      if (!_strm.next_out || !_strm.next_in && _strm.avail_in !== 0 || status == FINISH_STATE && flush != Z_FINISH) {
        _strm.msg = z_errmsg[Z_NEED_DICT - Z_STREAM_ERROR];
        return Z_STREAM_ERROR;
      }
      if (_strm.avail_out === 0) {
        _strm.msg = z_errmsg[Z_NEED_DICT - Z_BUF_ERROR];
        return Z_BUF_ERROR;
      }
      strm = _strm;
      old_flush = last_flush;
      last_flush = flush;
      if (status == INIT_STATE) {
        header = Z_DEFLATED + (w_bits - 8 << 4) << 8;
        level_flags = (level - 1 & 255) >> 1;
        if (level_flags > 3)
          level_flags = 3;
        header |= level_flags << 6;
        if (strstart !== 0)
          header |= PRESET_DICT;
        header += 31 - header % 31;
        status = BUSY_STATE;
        putShortMSB(header);
      }
      if (that.pending !== 0) {
        strm.flush_pending();
        if (strm.avail_out === 0) {
          last_flush = -1;
          return Z_OK;
        }
      } else if (strm.avail_in === 0 && flush <= old_flush && flush != Z_FINISH) {
        strm.msg = z_errmsg[Z_NEED_DICT - Z_BUF_ERROR];
        return Z_BUF_ERROR;
      }
      if (status == FINISH_STATE && strm.avail_in !== 0) {
        _strm.msg = z_errmsg[Z_NEED_DICT - Z_BUF_ERROR];
        return Z_BUF_ERROR;
      }
      if (strm.avail_in !== 0 || lookahead !== 0 || flush != Z_NO_FLUSH && status != FINISH_STATE) {
        bstate = -1;
        switch (config_table[level].func) {
          case STORED:
            bstate = deflate_stored(flush);
            break;
          case FAST:
            bstate = deflate_fast(flush);
            break;
          case SLOW:
            bstate = deflate_slow(flush);
            break;
        }
        if (bstate == FinishStarted || bstate == FinishDone) {
          status = FINISH_STATE;
        }
        if (bstate == NeedMore || bstate == FinishStarted) {
          if (strm.avail_out === 0) {
            last_flush = -1;
          }
          return Z_OK;
        }
        if (bstate == BlockDone) {
          if (flush == Z_PARTIAL_FLUSH) {
            _tr_align();
          } else {
            _tr_stored_block(0, 0, false);
            if (flush == Z_FULL_FLUSH) {
              for (i = 0; i < hash_size; i++)
                head[i] = 0;
            }
          }
          strm.flush_pending();
          if (strm.avail_out === 0) {
            last_flush = -1;
            return Z_OK;
          }
        }
      }
      if (flush != Z_FINISH)
        return Z_OK;
      return Z_STREAM_END;
    };
  }
  function ZStream() {
    var that = this;
    that.next_in_index = 0;
    that.next_out_index = 0;
    that.avail_in = 0;
    that.total_in = 0;
    that.avail_out = 0;
    that.total_out = 0;
  }
  ZStream.prototype = {
    deflateInit: function(level, bits) {
      var that = this;
      that.dstate = new Deflate2();
      if (!bits)
        bits = MAX_BITS;
      return that.dstate.deflateInit(that, level, bits);
    },
    deflate: function(flush) {
      var that = this;
      if (!that.dstate) {
        return Z_STREAM_ERROR;
      }
      return that.dstate.deflate(that, flush);
    },
    deflateEnd: function() {
      var that = this;
      if (!that.dstate)
        return Z_STREAM_ERROR;
      var ret = that.dstate.deflateEnd();
      that.dstate = null;
      return ret;
    },
    deflateParams: function(level, strategy) {
      var that = this;
      if (!that.dstate)
        return Z_STREAM_ERROR;
      return that.dstate.deflateParams(that, level, strategy);
    },
    deflateSetDictionary: function(dictionary, dictLength) {
      var that = this;
      if (!that.dstate)
        return Z_STREAM_ERROR;
      return that.dstate.deflateSetDictionary(that, dictionary, dictLength);
    },
    // Read a new buffer from the current input stream, update the
    // total number of bytes read. All deflate() input goes through
    // this function so some applications may wish to modify it to avoid
    // allocating a large strm->next_in buffer and copying from it.
    // (See also flush_pending()).
    read_buf: function(buf, start, size) {
      var that = this;
      var len = that.avail_in;
      if (len > size)
        len = size;
      if (len === 0)
        return 0;
      that.avail_in -= len;
      buf.set(that.next_in.subarray(that.next_in_index, that.next_in_index + len), start);
      that.next_in_index += len;
      that.total_in += len;
      return len;
    },
    // Flush as much pending output as possible. All deflate() output goes
    // through this function so some applications may wish to modify it
    // to avoid allocating a large strm->next_out buffer and copying into it.
    // (See also read_buf()).
    flush_pending: function() {
      var that = this;
      var len = that.dstate.pending;
      if (len > that.avail_out)
        len = that.avail_out;
      if (len === 0)
        return;
      that.next_out.set(that.dstate.pending_buf.subarray(that.dstate.pending_out, that.dstate.pending_out + len), that.next_out_index);
      that.next_out_index += len;
      that.dstate.pending_out += len;
      that.total_out += len;
      that.avail_out -= len;
      that.dstate.pending -= len;
      if (that.dstate.pending === 0) {
        that.dstate.pending_out = 0;
      }
    }
  };
  function Deflater(level) {
    var that = this;
    var z = new ZStream();
    var bufsize = 512;
    var flush = Z_NO_FLUSH;
    var buf = new Uint8Array(bufsize);
    if (typeof level == "undefined")
      level = Z_DEFAULT_COMPRESSION;
    z.deflateInit(level);
    z.next_out = buf;
    that.append = function(data, onprogress) {
      var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
      if (!data.length)
        return;
      z.next_in_index = 0;
      z.next_in = data;
      z.avail_in = data.length;
      do {
        z.next_out_index = 0;
        z.avail_out = bufsize;
        err = z.deflate(flush);
        if (err != Z_OK)
          throw "deflating: " + z.msg;
        if (z.next_out_index)
          if (z.next_out_index == bufsize)
            buffers.push(new Uint8Array(buf));
          else
            buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
        bufferSize += z.next_out_index;
        if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
          onprogress(z.next_in_index);
          lastIndex = z.next_in_index;
        }
      } while (z.avail_in > 0 || z.avail_out === 0);
      array = new Uint8Array(bufferSize);
      buffers.forEach(function(chunk) {
        array.set(chunk, bufferIndex);
        bufferIndex += chunk.length;
      });
      return array;
    };
    that.flush = function() {
      var err, buffers = [], bufferIndex = 0, bufferSize = 0, array;
      do {
        z.next_out_index = 0;
        z.avail_out = bufsize;
        err = z.deflate(Z_FINISH);
        if (err != Z_STREAM_END && err != Z_OK)
          throw "deflating: " + z.msg;
        if (bufsize - z.avail_out > 0)
          buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
        bufferSize += z.next_out_index;
      } while (z.avail_in > 0 || z.avail_out === 0);
      z.deflateEnd();
      array = new Uint8Array(bufferSize);
      buffers.forEach(function(chunk) {
        array.set(chunk, bufferIndex);
        bufferIndex += chunk.length;
      });
      return array;
    };
  }
  return Deflater;
})();

var Inflate = (function(obj) {
  var MAX_BITS = 15;
  var Z_OK = 0;
  var Z_STREAM_END = 1;
  var Z_NEED_DICT = 2;
  var Z_STREAM_ERROR = -2;
  var Z_DATA_ERROR = -3;
  var Z_MEM_ERROR = -4;
  var Z_BUF_ERROR = -5;
  var inflate_mask = [
    0,
    1,
    3,
    7,
    15,
    31,
    63,
    127,
    255,
    511,
    1023,
    2047,
    4095,
    8191,
    16383,
    32767,
    65535
  ];
  var MANY = 1440;
  var Z_NO_FLUSH = 0;
  var Z_FINISH = 4;
  var fixed_bl = 9;
  var fixed_bd = 5;
  var fixed_tl = [
    96,
    7,
    256,
    0,
    8,
    80,
    0,
    8,
    16,
    84,
    8,
    115,
    82,
    7,
    31,
    0,
    8,
    112,
    0,
    8,
    48,
    0,
    9,
    192,
    80,
    7,
    10,
    0,
    8,
    96,
    0,
    8,
    32,
    0,
    9,
    160,
    0,
    8,
    0,
    0,
    8,
    128,
    0,
    8,
    64,
    0,
    9,
    224,
    80,
    7,
    6,
    0,
    8,
    88,
    0,
    8,
    24,
    0,
    9,
    144,
    83,
    7,
    59,
    0,
    8,
    120,
    0,
    8,
    56,
    0,
    9,
    208,
    81,
    7,
    17,
    0,
    8,
    104,
    0,
    8,
    40,
    0,
    9,
    176,
    0,
    8,
    8,
    0,
    8,
    136,
    0,
    8,
    72,
    0,
    9,
    240,
    80,
    7,
    4,
    0,
    8,
    84,
    0,
    8,
    20,
    85,
    8,
    227,
    83,
    7,
    43,
    0,
    8,
    116,
    0,
    8,
    52,
    0,
    9,
    200,
    81,
    7,
    13,
    0,
    8,
    100,
    0,
    8,
    36,
    0,
    9,
    168,
    0,
    8,
    4,
    0,
    8,
    132,
    0,
    8,
    68,
    0,
    9,
    232,
    80,
    7,
    8,
    0,
    8,
    92,
    0,
    8,
    28,
    0,
    9,
    152,
    84,
    7,
    83,
    0,
    8,
    124,
    0,
    8,
    60,
    0,
    9,
    216,
    82,
    7,
    23,
    0,
    8,
    108,
    0,
    8,
    44,
    0,
    9,
    184,
    0,
    8,
    12,
    0,
    8,
    140,
    0,
    8,
    76,
    0,
    9,
    248,
    80,
    7,
    3,
    0,
    8,
    82,
    0,
    8,
    18,
    85,
    8,
    163,
    83,
    7,
    35,
    0,
    8,
    114,
    0,
    8,
    50,
    0,
    9,
    196,
    81,
    7,
    11,
    0,
    8,
    98,
    0,
    8,
    34,
    0,
    9,
    164,
    0,
    8,
    2,
    0,
    8,
    130,
    0,
    8,
    66,
    0,
    9,
    228,
    80,
    7,
    7,
    0,
    8,
    90,
    0,
    8,
    26,
    0,
    9,
    148,
    84,
    7,
    67,
    0,
    8,
    122,
    0,
    8,
    58,
    0,
    9,
    212,
    82,
    7,
    19,
    0,
    8,
    106,
    0,
    8,
    42,
    0,
    9,
    180,
    0,
    8,
    10,
    0,
    8,
    138,
    0,
    8,
    74,
    0,
    9,
    244,
    80,
    7,
    5,
    0,
    8,
    86,
    0,
    8,
    22,
    192,
    8,
    0,
    83,
    7,
    51,
    0,
    8,
    118,
    0,
    8,
    54,
    0,
    9,
    204,
    81,
    7,
    15,
    0,
    8,
    102,
    0,
    8,
    38,
    0,
    9,
    172,
    0,
    8,
    6,
    0,
    8,
    134,
    0,
    8,
    70,
    0,
    9,
    236,
    80,
    7,
    9,
    0,
    8,
    94,
    0,
    8,
    30,
    0,
    9,
    156,
    84,
    7,
    99,
    0,
    8,
    126,
    0,
    8,
    62,
    0,
    9,
    220,
    82,
    7,
    27,
    0,
    8,
    110,
    0,
    8,
    46,
    0,
    9,
    188,
    0,
    8,
    14,
    0,
    8,
    142,
    0,
    8,
    78,
    0,
    9,
    252,
    96,
    7,
    256,
    0,
    8,
    81,
    0,
    8,
    17,
    85,
    8,
    131,
    82,
    7,
    31,
    0,
    8,
    113,
    0,
    8,
    49,
    0,
    9,
    194,
    80,
    7,
    10,
    0,
    8,
    97,
    0,
    8,
    33,
    0,
    9,
    162,
    0,
    8,
    1,
    0,
    8,
    129,
    0,
    8,
    65,
    0,
    9,
    226,
    80,
    7,
    6,
    0,
    8,
    89,
    0,
    8,
    25,
    0,
    9,
    146,
    83,
    7,
    59,
    0,
    8,
    121,
    0,
    8,
    57,
    0,
    9,
    210,
    81,
    7,
    17,
    0,
    8,
    105,
    0,
    8,
    41,
    0,
    9,
    178,
    0,
    8,
    9,
    0,
    8,
    137,
    0,
    8,
    73,
    0,
    9,
    242,
    80,
    7,
    4,
    0,
    8,
    85,
    0,
    8,
    21,
    80,
    8,
    258,
    83,
    7,
    43,
    0,
    8,
    117,
    0,
    8,
    53,
    0,
    9,
    202,
    81,
    7,
    13,
    0,
    8,
    101,
    0,
    8,
    37,
    0,
    9,
    170,
    0,
    8,
    5,
    0,
    8,
    133,
    0,
    8,
    69,
    0,
    9,
    234,
    80,
    7,
    8,
    0,
    8,
    93,
    0,
    8,
    29,
    0,
    9,
    154,
    84,
    7,
    83,
    0,
    8,
    125,
    0,
    8,
    61,
    0,
    9,
    218,
    82,
    7,
    23,
    0,
    8,
    109,
    0,
    8,
    45,
    0,
    9,
    186,
    0,
    8,
    13,
    0,
    8,
    141,
    0,
    8,
    77,
    0,
    9,
    250,
    80,
    7,
    3,
    0,
    8,
    83,
    0,
    8,
    19,
    85,
    8,
    195,
    83,
    7,
    35,
    0,
    8,
    115,
    0,
    8,
    51,
    0,
    9,
    198,
    81,
    7,
    11,
    0,
    8,
    99,
    0,
    8,
    35,
    0,
    9,
    166,
    0,
    8,
    3,
    0,
    8,
    131,
    0,
    8,
    67,
    0,
    9,
    230,
    80,
    7,
    7,
    0,
    8,
    91,
    0,
    8,
    27,
    0,
    9,
    150,
    84,
    7,
    67,
    0,
    8,
    123,
    0,
    8,
    59,
    0,
    9,
    214,
    82,
    7,
    19,
    0,
    8,
    107,
    0,
    8,
    43,
    0,
    9,
    182,
    0,
    8,
    11,
    0,
    8,
    139,
    0,
    8,
    75,
    0,
    9,
    246,
    80,
    7,
    5,
    0,
    8,
    87,
    0,
    8,
    23,
    192,
    8,
    0,
    83,
    7,
    51,
    0,
    8,
    119,
    0,
    8,
    55,
    0,
    9,
    206,
    81,
    7,
    15,
    0,
    8,
    103,
    0,
    8,
    39,
    0,
    9,
    174,
    0,
    8,
    7,
    0,
    8,
    135,
    0,
    8,
    71,
    0,
    9,
    238,
    80,
    7,
    9,
    0,
    8,
    95,
    0,
    8,
    31,
    0,
    9,
    158,
    84,
    7,
    99,
    0,
    8,
    127,
    0,
    8,
    63,
    0,
    9,
    222,
    82,
    7,
    27,
    0,
    8,
    111,
    0,
    8,
    47,
    0,
    9,
    190,
    0,
    8,
    15,
    0,
    8,
    143,
    0,
    8,
    79,
    0,
    9,
    254,
    96,
    7,
    256,
    0,
    8,
    80,
    0,
    8,
    16,
    84,
    8,
    115,
    82,
    7,
    31,
    0,
    8,
    112,
    0,
    8,
    48,
    0,
    9,
    193,
    80,
    7,
    10,
    0,
    8,
    96,
    0,
    8,
    32,
    0,
    9,
    161,
    0,
    8,
    0,
    0,
    8,
    128,
    0,
    8,
    64,
    0,
    9,
    225,
    80,
    7,
    6,
    0,
    8,
    88,
    0,
    8,
    24,
    0,
    9,
    145,
    83,
    7,
    59,
    0,
    8,
    120,
    0,
    8,
    56,
    0,
    9,
    209,
    81,
    7,
    17,
    0,
    8,
    104,
    0,
    8,
    40,
    0,
    9,
    177,
    0,
    8,
    8,
    0,
    8,
    136,
    0,
    8,
    72,
    0,
    9,
    241,
    80,
    7,
    4,
    0,
    8,
    84,
    0,
    8,
    20,
    85,
    8,
    227,
    83,
    7,
    43,
    0,
    8,
    116,
    0,
    8,
    52,
    0,
    9,
    201,
    81,
    7,
    13,
    0,
    8,
    100,
    0,
    8,
    36,
    0,
    9,
    169,
    0,
    8,
    4,
    0,
    8,
    132,
    0,
    8,
    68,
    0,
    9,
    233,
    80,
    7,
    8,
    0,
    8,
    92,
    0,
    8,
    28,
    0,
    9,
    153,
    84,
    7,
    83,
    0,
    8,
    124,
    0,
    8,
    60,
    0,
    9,
    217,
    82,
    7,
    23,
    0,
    8,
    108,
    0,
    8,
    44,
    0,
    9,
    185,
    0,
    8,
    12,
    0,
    8,
    140,
    0,
    8,
    76,
    0,
    9,
    249,
    80,
    7,
    3,
    0,
    8,
    82,
    0,
    8,
    18,
    85,
    8,
    163,
    83,
    7,
    35,
    0,
    8,
    114,
    0,
    8,
    50,
    0,
    9,
    197,
    81,
    7,
    11,
    0,
    8,
    98,
    0,
    8,
    34,
    0,
    9,
    165,
    0,
    8,
    2,
    0,
    8,
    130,
    0,
    8,
    66,
    0,
    9,
    229,
    80,
    7,
    7,
    0,
    8,
    90,
    0,
    8,
    26,
    0,
    9,
    149,
    84,
    7,
    67,
    0,
    8,
    122,
    0,
    8,
    58,
    0,
    9,
    213,
    82,
    7,
    19,
    0,
    8,
    106,
    0,
    8,
    42,
    0,
    9,
    181,
    0,
    8,
    10,
    0,
    8,
    138,
    0,
    8,
    74,
    0,
    9,
    245,
    80,
    7,
    5,
    0,
    8,
    86,
    0,
    8,
    22,
    192,
    8,
    0,
    83,
    7,
    51,
    0,
    8,
    118,
    0,
    8,
    54,
    0,
    9,
    205,
    81,
    7,
    15,
    0,
    8,
    102,
    0,
    8,
    38,
    0,
    9,
    173,
    0,
    8,
    6,
    0,
    8,
    134,
    0,
    8,
    70,
    0,
    9,
    237,
    80,
    7,
    9,
    0,
    8,
    94,
    0,
    8,
    30,
    0,
    9,
    157,
    84,
    7,
    99,
    0,
    8,
    126,
    0,
    8,
    62,
    0,
    9,
    221,
    82,
    7,
    27,
    0,
    8,
    110,
    0,
    8,
    46,
    0,
    9,
    189,
    0,
    8,
    14,
    0,
    8,
    142,
    0,
    8,
    78,
    0,
    9,
    253,
    96,
    7,
    256,
    0,
    8,
    81,
    0,
    8,
    17,
    85,
    8,
    131,
    82,
    7,
    31,
    0,
    8,
    113,
    0,
    8,
    49,
    0,
    9,
    195,
    80,
    7,
    10,
    0,
    8,
    97,
    0,
    8,
    33,
    0,
    9,
    163,
    0,
    8,
    1,
    0,
    8,
    129,
    0,
    8,
    65,
    0,
    9,
    227,
    80,
    7,
    6,
    0,
    8,
    89,
    0,
    8,
    25,
    0,
    9,
    147,
    83,
    7,
    59,
    0,
    8,
    121,
    0,
    8,
    57,
    0,
    9,
    211,
    81,
    7,
    17,
    0,
    8,
    105,
    0,
    8,
    41,
    0,
    9,
    179,
    0,
    8,
    9,
    0,
    8,
    137,
    0,
    8,
    73,
    0,
    9,
    243,
    80,
    7,
    4,
    0,
    8,
    85,
    0,
    8,
    21,
    80,
    8,
    258,
    83,
    7,
    43,
    0,
    8,
    117,
    0,
    8,
    53,
    0,
    9,
    203,
    81,
    7,
    13,
    0,
    8,
    101,
    0,
    8,
    37,
    0,
    9,
    171,
    0,
    8,
    5,
    0,
    8,
    133,
    0,
    8,
    69,
    0,
    9,
    235,
    80,
    7,
    8,
    0,
    8,
    93,
    0,
    8,
    29,
    0,
    9,
    155,
    84,
    7,
    83,
    0,
    8,
    125,
    0,
    8,
    61,
    0,
    9,
    219,
    82,
    7,
    23,
    0,
    8,
    109,
    0,
    8,
    45,
    0,
    9,
    187,
    0,
    8,
    13,
    0,
    8,
    141,
    0,
    8,
    77,
    0,
    9,
    251,
    80,
    7,
    3,
    0,
    8,
    83,
    0,
    8,
    19,
    85,
    8,
    195,
    83,
    7,
    35,
    0,
    8,
    115,
    0,
    8,
    51,
    0,
    9,
    199,
    81,
    7,
    11,
    0,
    8,
    99,
    0,
    8,
    35,
    0,
    9,
    167,
    0,
    8,
    3,
    0,
    8,
    131,
    0,
    8,
    67,
    0,
    9,
    231,
    80,
    7,
    7,
    0,
    8,
    91,
    0,
    8,
    27,
    0,
    9,
    151,
    84,
    7,
    67,
    0,
    8,
    123,
    0,
    8,
    59,
    0,
    9,
    215,
    82,
    7,
    19,
    0,
    8,
    107,
    0,
    8,
    43,
    0,
    9,
    183,
    0,
    8,
    11,
    0,
    8,
    139,
    0,
    8,
    75,
    0,
    9,
    247,
    80,
    7,
    5,
    0,
    8,
    87,
    0,
    8,
    23,
    192,
    8,
    0,
    83,
    7,
    51,
    0,
    8,
    119,
    0,
    8,
    55,
    0,
    9,
    207,
    81,
    7,
    15,
    0,
    8,
    103,
    0,
    8,
    39,
    0,
    9,
    175,
    0,
    8,
    7,
    0,
    8,
    135,
    0,
    8,
    71,
    0,
    9,
    239,
    80,
    7,
    9,
    0,
    8,
    95,
    0,
    8,
    31,
    0,
    9,
    159,
    84,
    7,
    99,
    0,
    8,
    127,
    0,
    8,
    63,
    0,
    9,
    223,
    82,
    7,
    27,
    0,
    8,
    111,
    0,
    8,
    47,
    0,
    9,
    191,
    0,
    8,
    15,
    0,
    8,
    143,
    0,
    8,
    79,
    0,
    9,
    255
  ];
  var fixed_td = [
    80,
    5,
    1,
    87,
    5,
    257,
    83,
    5,
    17,
    91,
    5,
    4097,
    81,
    5,
    5,
    89,
    5,
    1025,
    85,
    5,
    65,
    93,
    5,
    16385,
    80,
    5,
    3,
    88,
    5,
    513,
    84,
    5,
    33,
    92,
    5,
    8193,
    82,
    5,
    9,
    90,
    5,
    2049,
    86,
    5,
    129,
    192,
    5,
    24577,
    80,
    5,
    2,
    87,
    5,
    385,
    83,
    5,
    25,
    91,
    5,
    6145,
    81,
    5,
    7,
    89,
    5,
    1537,
    85,
    5,
    97,
    93,
    5,
    24577,
    80,
    5,
    4,
    88,
    5,
    769,
    84,
    5,
    49,
    92,
    5,
    12289,
    82,
    5,
    13,
    90,
    5,
    3073,
    86,
    5,
    193,
    192,
    5,
    24577
  ];
  var cplens = [
    // Copy lengths for literal codes 257..285
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    13,
    15,
    17,
    19,
    23,
    27,
    31,
    35,
    43,
    51,
    59,
    67,
    83,
    99,
    115,
    131,
    163,
    195,
    227,
    258,
    0,
    0
  ];
  var cplext = [
    // Extra bits for literal codes 257..285
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    1,
    1,
    1,
    2,
    2,
    2,
    2,
    3,
    3,
    3,
    3,
    4,
    4,
    4,
    4,
    5,
    5,
    5,
    5,
    0,
    112,
    112
    // 112==invalid
  ];
  var cpdist = [
    // Copy offsets for distance codes 0..29
    1,
    2,
    3,
    4,
    5,
    7,
    9,
    13,
    17,
    25,
    33,
    49,
    65,
    97,
    129,
    193,
    257,
    385,
    513,
    769,
    1025,
    1537,
    2049,
    3073,
    4097,
    6145,
    8193,
    12289,
    16385,
    24577
  ];
  var cpdext = [
    // Extra bits for distance codes
    0,
    0,
    0,
    0,
    1,
    1,
    2,
    2,
    3,
    3,
    4,
    4,
    5,
    5,
    6,
    6,
    7,
    7,
    8,
    8,
    9,
    9,
    10,
    10,
    11,
    11,
    12,
    12,
    13,
    13
  ];
  var BMAX = 15;
  function InfTree() {
    var that = this;
    var hn;
    var v;
    var c;
    var r;
    var u;
    var x;
    function huft_build(b, bindex, n, s, d, e, t, m, hp, hn2, v2) {
      var a;
      var f;
      var g;
      var h;
      var i;
      var j;
      var k;
      var l;
      var mask;
      var p;
      var q;
      var w;
      var xp;
      var y;
      var z;
      p = 0;
      i = n;
      do {
        c[b[bindex + p]]++;
        p++;
        i--;
      } while (i !== 0);
      if (c[0] == n) {
        t[0] = -1;
        m[0] = 0;
        return Z_OK;
      }
      l = m[0];
      for (j = 1; j <= BMAX; j++)
        if (c[j] !== 0)
          break;
      k = j;
      if (l < j) {
        l = j;
      }
      for (i = BMAX; i !== 0; i--) {
        if (c[i] !== 0)
          break;
      }
      g = i;
      if (l > i) {
        l = i;
      }
      m[0] = l;
      for (y = 1 << j; j < i; j++, y <<= 1) {
        if ((y -= c[j]) < 0) {
          return Z_DATA_ERROR;
        }
      }
      if ((y -= c[i]) < 0) {
        return Z_DATA_ERROR;
      }
      c[i] += y;
      x[1] = j = 0;
      p = 1;
      xp = 2;
      while (--i !== 0) {
        x[xp] = j += c[p];
        xp++;
        p++;
      }
      i = 0;
      p = 0;
      do {
        if ((j = b[bindex + p]) !== 0) {
          v2[x[j]++] = i;
        }
        p++;
      } while (++i < n);
      n = x[g];
      x[0] = i = 0;
      p = 0;
      h = -1;
      w = -l;
      u[0] = 0;
      q = 0;
      z = 0;
      for (; k <= g; k++) {
        a = c[k];
        while (a-- !== 0) {
          while (k > w + l) {
            h++;
            w += l;
            z = g - w;
            z = z > l ? l : z;
            if ((f = 1 << (j = k - w)) > a + 1) {
              f -= a + 1;
              xp = k;
              if (j < z) {
                while (++j < z) {
                  if ((f <<= 1) <= c[++xp])
                    break;
                  f -= c[xp];
                }
              }
            }
            z = 1 << j;
            if (hn2[0] + z > MANY) {
              return Z_DATA_ERROR;
            }
            u[h] = q = /* hp+ */
            hn2[0];
            hn2[0] += z;
            if (h !== 0) {
              x[h] = i;
              r[0] = /* (byte) */
              j;
              r[1] = /* (byte) */
              l;
              j = i >>> w - l;
              r[2] = /* (int) */
              q - u[h - 1] - j;
              hp.set(r, (u[h - 1] + j) * 3);
            } else {
              t[0] = q;
            }
          }
          r[1] = /* (byte) */
          k - w;
          if (p >= n) {
            r[0] = 128 + 64;
          } else if (v2[p] < s) {
            r[0] = /* (byte) */
            v2[p] < 256 ? 0 : 32 + 64;
            r[2] = v2[p++];
          } else {
            r[0] = /* (byte) */
            e[v2[p] - s] + 16 + 64;
            r[2] = d[v2[p++] - s];
          }
          f = 1 << k - w;
          for (j = i >>> w; j < z; j += f) {
            hp.set(r, (q + j) * 3);
          }
          for (j = 1 << k - 1; (i & j) !== 0; j >>>= 1) {
            i ^= j;
          }
          i ^= j;
          mask = (1 << w) - 1;
          while ((i & mask) != x[h]) {
            h--;
            w -= l;
            mask = (1 << w) - 1;
          }
        }
      }
      return y !== 0 && g != 1 ? Z_BUF_ERROR : Z_OK;
    }
    function initWorkArea(vsize) {
      var i;
      if (!hn) {
        hn = [];
        v = [];
        c = new Int32Array(BMAX + 1);
        r = [];
        u = new Int32Array(BMAX);
        x = new Int32Array(BMAX + 1);
      }
      if (v.length < vsize) {
        v = [];
      }
      for (i = 0; i < vsize; i++) {
        v[i] = 0;
      }
      for (i = 0; i < BMAX + 1; i++) {
        c[i] = 0;
      }
      for (i = 0; i < 3; i++) {
        r[i] = 0;
      }
      u.set(c.subarray(0, BMAX), 0);
      x.set(c.subarray(0, BMAX + 1), 0);
    }
    that.inflate_trees_bits = function(c2, bb, tb, hp, z) {
      var result;
      initWorkArea(19);
      hn[0] = 0;
      result = huft_build(c2, 0, 19, 19, null, null, tb, bb, hp, hn, v);
      if (result == Z_DATA_ERROR) {
        z.msg = "oversubscribed dynamic bit lengths tree";
      } else if (result == Z_BUF_ERROR || bb[0] === 0) {
        z.msg = "incomplete dynamic bit lengths tree";
        result = Z_DATA_ERROR;
      }
      return result;
    };
    that.inflate_trees_dynamic = function(nl, nd, c2, bl, bd, tl, td, hp, z) {
      var result;
      initWorkArea(288);
      hn[0] = 0;
      result = huft_build(c2, 0, nl, 257, cplens, cplext, tl, bl, hp, hn, v);
      if (result != Z_OK || bl[0] === 0) {
        if (result == Z_DATA_ERROR) {
          z.msg = "oversubscribed literal/length tree";
        } else if (result != Z_MEM_ERROR) {
          z.msg = "incomplete literal/length tree";
          result = Z_DATA_ERROR;
        }
        return result;
      }
      initWorkArea(288);
      result = huft_build(c2, nl, nd, 0, cpdist, cpdext, td, bd, hp, hn, v);
      if (result != Z_OK || bd[0] === 0 && nl > 257) {
        if (result == Z_DATA_ERROR) {
          z.msg = "oversubscribed distance tree";
        } else if (result == Z_BUF_ERROR) {
          z.msg = "incomplete distance tree";
          result = Z_DATA_ERROR;
        } else if (result != Z_MEM_ERROR) {
          z.msg = "empty distance tree with lengths";
          result = Z_DATA_ERROR;
        }
        return result;
      }
      return Z_OK;
    };
  }
  InfTree.inflate_trees_fixed = function(bl, bd, tl, td) {
    bl[0] = fixed_bl;
    bd[0] = fixed_bd;
    tl[0] = fixed_tl;
    td[0] = fixed_td;
    return Z_OK;
  };
  var START = 0;
  var LEN = 1;
  var LENEXT = 2;
  var DIST = 3;
  var DISTEXT = 4;
  var COPY = 5;
  var LIT = 6;
  var WASH = 7;
  var END = 8;
  var BADCODE = 9;
  function InfCodes() {
    var that = this;
    var mode;
    var len = 0;
    var tree;
    var tree_index = 0;
    var need = 0;
    var lit = 0;
    var get = 0;
    var dist = 0;
    var lbits = 0;
    var dbits = 0;
    var ltree;
    var ltree_index = 0;
    var dtree;
    var dtree_index = 0;
    function inflate_fast(bl, bd, tl, tl_index, td, td_index, s, z) {
      var t;
      var tp;
      var tp_index;
      var e;
      var b;
      var k;
      var p;
      var n;
      var q;
      var m;
      var ml;
      var md;
      var c;
      var d;
      var r;
      var tp_index_t_3;
      p = z.next_in_index;
      n = z.avail_in;
      b = s.bitb;
      k = s.bitk;
      q = s.write;
      m = q < s.read ? s.read - q - 1 : s.end - q;
      ml = inflate_mask[bl];
      md = inflate_mask[bd];
      do {
        while (k < 20) {
          n--;
          b |= (z.read_byte(p++) & 255) << k;
          k += 8;
        }
        t = b & ml;
        tp = tl;
        tp_index = tl_index;
        tp_index_t_3 = (tp_index + t) * 3;
        if ((e = tp[tp_index_t_3]) === 0) {
          b >>= tp[tp_index_t_3 + 1];
          k -= tp[tp_index_t_3 + 1];
          s.window[q++] = /* (byte) */
          tp[tp_index_t_3 + 2];
          m--;
          continue;
        }
        do {
          b >>= tp[tp_index_t_3 + 1];
          k -= tp[tp_index_t_3 + 1];
          if ((e & 16) !== 0) {
            e &= 15;
            c = tp[tp_index_t_3 + 2] + /* (int) */
            (b & inflate_mask[e]);
            b >>= e;
            k -= e;
            while (k < 15) {
              n--;
              b |= (z.read_byte(p++) & 255) << k;
              k += 8;
            }
            t = b & md;
            tp = td;
            tp_index = td_index;
            tp_index_t_3 = (tp_index + t) * 3;
            e = tp[tp_index_t_3];
            do {
              b >>= tp[tp_index_t_3 + 1];
              k -= tp[tp_index_t_3 + 1];
              if ((e & 16) !== 0) {
                e &= 15;
                while (k < e) {
                  n--;
                  b |= (z.read_byte(p++) & 255) << k;
                  k += 8;
                }
                d = tp[tp_index_t_3 + 2] + (b & inflate_mask[e]);
                b >>= e;
                k -= e;
                m -= c;
                if (q >= d) {
                  r = q - d;
                  if (q - r > 0 && 2 > q - r) {
                    s.window[q++] = s.window[r++];
                    s.window[q++] = s.window[r++];
                    c -= 2;
                  } else {
                    s.window.set(s.window.subarray(r, r + 2), q);
                    q += 2;
                    r += 2;
                    c -= 2;
                  }
                } else {
                  r = q - d;
                  do {
                    r += s.end;
                  } while (r < 0);
                  e = s.end - r;
                  if (c > e) {
                    c -= e;
                    if (q - r > 0 && e > q - r) {
                      do {
                        s.window[q++] = s.window[r++];
                      } while (--e !== 0);
                    } else {
                      s.window.set(s.window.subarray(r, r + e), q);
                      q += e;
                      r += e;
                      e = 0;
                    }
                    r = 0;
                  }
                }
                if (q - r > 0 && c > q - r) {
                  do {
                    s.window[q++] = s.window[r++];
                  } while (--c !== 0);
                } else {
                  s.window.set(s.window.subarray(r, r + c), q);
                  q += c;
                  r += c;
                  c = 0;
                }
                break;
              } else if ((e & 64) === 0) {
                t += tp[tp_index_t_3 + 2];
                t += b & inflate_mask[e];
                tp_index_t_3 = (tp_index + t) * 3;
                e = tp[tp_index_t_3];
              } else {
                z.msg = "invalid distance code";
                c = z.avail_in - n;
                c = k >> 3 < c ? k >> 3 : c;
                n += c;
                p -= c;
                k -= c << 3;
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return Z_DATA_ERROR;
              }
            } while (true);
            break;
          }
          if ((e & 64) === 0) {
            t += tp[tp_index_t_3 + 2];
            t += b & inflate_mask[e];
            tp_index_t_3 = (tp_index + t) * 3;
            if ((e = tp[tp_index_t_3]) === 0) {
              b >>= tp[tp_index_t_3 + 1];
              k -= tp[tp_index_t_3 + 1];
              s.window[q++] = /* (byte) */
              tp[tp_index_t_3 + 2];
              m--;
              break;
            }
          } else if ((e & 32) !== 0) {
            c = z.avail_in - n;
            c = k >> 3 < c ? k >> 3 : c;
            n += c;
            p -= c;
            k -= c << 3;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return Z_STREAM_END;
          } else {
            z.msg = "invalid literal/length code";
            c = z.avail_in - n;
            c = k >> 3 < c ? k >> 3 : c;
            n += c;
            p -= c;
            k -= c << 3;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return Z_DATA_ERROR;
          }
        } while (true);
      } while (m >= 258 && n >= 10);
      c = z.avail_in - n;
      c = k >> 3 < c ? k >> 3 : c;
      n += c;
      p -= c;
      k -= c << 3;
      s.bitb = b;
      s.bitk = k;
      z.avail_in = n;
      z.total_in += p - z.next_in_index;
      z.next_in_index = p;
      s.write = q;
      return Z_OK;
    }
    that.init = function(bl, bd, tl, tl_index, td, td_index) {
      mode = START;
      lbits = /* (byte) */
      bl;
      dbits = /* (byte) */
      bd;
      ltree = tl;
      ltree_index = tl_index;
      dtree = td;
      dtree_index = td_index;
      tree = null;
    };
    that.proc = function(s, z, r) {
      var j;
      var tindex;
      var e;
      var b = 0;
      var k = 0;
      var p = 0;
      var n;
      var q;
      var m;
      var f;
      p = z.next_in_index;
      n = z.avail_in;
      b = s.bitb;
      k = s.bitk;
      q = s.write;
      m = q < s.read ? s.read - q - 1 : s.end - q;
      while (true) {
        switch (mode) {
          // waiting for "i:"=input, "o:"=output, "x:"=nothing
          case START:
            if (m >= 258 && n >= 10) {
              s.bitb = b;
              s.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              s.write = q;
              r = inflate_fast(lbits, dbits, ltree, ltree_index, dtree, dtree_index, s, z);
              p = z.next_in_index;
              n = z.avail_in;
              b = s.bitb;
              k = s.bitk;
              q = s.write;
              m = q < s.read ? s.read - q - 1 : s.end - q;
              if (r != Z_OK) {
                mode = r == Z_STREAM_END ? WASH : BADCODE;
                break;
              }
            }
            need = lbits;
            tree = ltree;
            tree_index = ltree_index;
            mode = LEN;
          /* falls through */
          case LEN:
            j = need;
            while (k < j) {
              if (n !== 0)
                r = Z_OK;
              else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 255) << k;
              k += 8;
            }
            tindex = (tree_index + (b & inflate_mask[j])) * 3;
            b >>>= tree[tindex + 1];
            k -= tree[tindex + 1];
            e = tree[tindex];
            if (e === 0) {
              lit = tree[tindex + 2];
              mode = LIT;
              break;
            }
            if ((e & 16) !== 0) {
              get = e & 15;
              len = tree[tindex + 2];
              mode = LENEXT;
              break;
            }
            if ((e & 64) === 0) {
              need = e;
              tree_index = tindex / 3 + tree[tindex + 2];
              break;
            }
            if ((e & 32) !== 0) {
              mode = WASH;
              break;
            }
            mode = BADCODE;
            z.msg = "invalid literal/length code";
            r = Z_DATA_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);
          case LENEXT:
            j = get;
            while (k < j) {
              if (n !== 0)
                r = Z_OK;
              else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 255) << k;
              k += 8;
            }
            len += b & inflate_mask[j];
            b >>= j;
            k -= j;
            need = dbits;
            tree = dtree;
            tree_index = dtree_index;
            mode = DIST;
          /* falls through */
          case DIST:
            j = need;
            while (k < j) {
              if (n !== 0)
                r = Z_OK;
              else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 255) << k;
              k += 8;
            }
            tindex = (tree_index + (b & inflate_mask[j])) * 3;
            b >>= tree[tindex + 1];
            k -= tree[tindex + 1];
            e = tree[tindex];
            if ((e & 16) !== 0) {
              get = e & 15;
              dist = tree[tindex + 2];
              mode = DISTEXT;
              break;
            }
            if ((e & 64) === 0) {
              need = e;
              tree_index = tindex / 3 + tree[tindex + 2];
              break;
            }
            mode = BADCODE;
            z.msg = "invalid distance code";
            r = Z_DATA_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);
          case DISTEXT:
            j = get;
            while (k < j) {
              if (n !== 0)
                r = Z_OK;
              else {
                s.bitb = b;
                s.bitk = k;
                z.avail_in = n;
                z.total_in += p - z.next_in_index;
                z.next_in_index = p;
                s.write = q;
                return s.inflate_flush(z, r);
              }
              n--;
              b |= (z.read_byte(p++) & 255) << k;
              k += 8;
            }
            dist += b & inflate_mask[j];
            b >>= j;
            k -= j;
            mode = COPY;
          /* falls through */
          case COPY:
            f = q - dist;
            while (f < 0) {
              f += s.end;
            }
            while (len !== 0) {
              if (m === 0) {
                if (q == s.end && s.read !== 0) {
                  q = 0;
                  m = q < s.read ? s.read - q - 1 : s.end - q;
                }
                if (m === 0) {
                  s.write = q;
                  r = s.inflate_flush(z, r);
                  q = s.write;
                  m = q < s.read ? s.read - q - 1 : s.end - q;
                  if (q == s.end && s.read !== 0) {
                    q = 0;
                    m = q < s.read ? s.read - q - 1 : s.end - q;
                  }
                  if (m === 0) {
                    s.bitb = b;
                    s.bitk = k;
                    z.avail_in = n;
                    z.total_in += p - z.next_in_index;
                    z.next_in_index = p;
                    s.write = q;
                    return s.inflate_flush(z, r);
                  }
                }
              }
              s.window[q++] = s.window[f++];
              m--;
              if (f == s.end)
                f = 0;
              len--;
            }
            mode = START;
            break;
          case LIT:
            if (m === 0) {
              if (q == s.end && s.read !== 0) {
                q = 0;
                m = q < s.read ? s.read - q - 1 : s.end - q;
              }
              if (m === 0) {
                s.write = q;
                r = s.inflate_flush(z, r);
                q = s.write;
                m = q < s.read ? s.read - q - 1 : s.end - q;
                if (q == s.end && s.read !== 0) {
                  q = 0;
                  m = q < s.read ? s.read - q - 1 : s.end - q;
                }
                if (m === 0) {
                  s.bitb = b;
                  s.bitk = k;
                  z.avail_in = n;
                  z.total_in += p - z.next_in_index;
                  z.next_in_index = p;
                  s.write = q;
                  return s.inflate_flush(z, r);
                }
              }
            }
            r = Z_OK;
            s.window[q++] = /* (byte) */
            lit;
            m--;
            mode = START;
            break;
          case WASH:
            if (k > 7) {
              k -= 8;
              n++;
              p--;
            }
            s.write = q;
            r = s.inflate_flush(z, r);
            q = s.write;
            m = q < s.read ? s.read - q - 1 : s.end - q;
            if (s.read != s.write) {
              s.bitb = b;
              s.bitk = k;
              z.avail_in = n;
              z.total_in += p - z.next_in_index;
              z.next_in_index = p;
              s.write = q;
              return s.inflate_flush(z, r);
            }
            mode = END;
          /* falls through */
          case END:
            r = Z_STREAM_END;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);
          case BADCODE:
            r = Z_DATA_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);
          default:
            r = Z_STREAM_ERROR;
            s.bitb = b;
            s.bitk = k;
            z.avail_in = n;
            z.total_in += p - z.next_in_index;
            z.next_in_index = p;
            s.write = q;
            return s.inflate_flush(z, r);
        }
      }
    };
    that.free = function() {
    };
  }
  var border = [
    // Order of the bit length code lengths
    16,
    17,
    18,
    0,
    8,
    7,
    9,
    6,
    10,
    5,
    11,
    4,
    12,
    3,
    13,
    2,
    14,
    1,
    15
  ];
  var TYPE = 0;
  var LENS = 1;
  var STORED = 2;
  var TABLE = 3;
  var BTREE = 4;
  var DTREE = 5;
  var CODES = 6;
  var DRY = 7;
  var DONELOCKS = 8;
  var BADBLOCKS = 9;
  function InfBlocks(z, w) {
    var that = this;
    var mode = TYPE;
    var left = 0;
    var table = 0;
    var index = 0;
    var blens;
    var bb = [0];
    var tb = [0];
    var codes = new InfCodes();
    var last = 0;
    var hufts = new Int32Array(MANY * 3);
    var check = 0;
    var inftree = new InfTree();
    that.bitk = 0;
    that.bitb = 0;
    that.window = new Uint8Array(w);
    that.end = w;
    that.read = 0;
    that.write = 0;
    that.reset = function(z2, c) {
      if (c)
        c[0] = check;
      if (mode == CODES) {
        codes.free(z2);
      }
      mode = TYPE;
      that.bitk = 0;
      that.bitb = 0;
      that.read = that.write = 0;
    };
    that.reset(z, null);
    that.inflate_flush = function(z2, r) {
      var n;
      var p;
      var q;
      p = z2.next_out_index;
      q = that.read;
      n = /* (int) */
      (q <= that.write ? that.write : that.end) - q;
      if (n > z2.avail_out)
        n = z2.avail_out;
      if (n !== 0 && r == Z_BUF_ERROR)
        r = Z_OK;
      z2.avail_out -= n;
      z2.total_out += n;
      z2.next_out.set(that.window.subarray(q, q + n), p);
      p += n;
      q += n;
      if (q == that.end) {
        q = 0;
        if (that.write == that.end)
          that.write = 0;
        n = that.write - q;
        if (n > z2.avail_out)
          n = z2.avail_out;
        if (n !== 0 && r == Z_BUF_ERROR)
          r = Z_OK;
        z2.avail_out -= n;
        z2.total_out += n;
        z2.next_out.set(that.window.subarray(q, q + n), p);
        p += n;
        q += n;
      }
      z2.next_out_index = p;
      that.read = q;
      return r;
    };
    that.proc = function(z2, r) {
      var t;
      var b;
      var k;
      var p;
      var n;
      var q;
      var m;
      var i;
      p = z2.next_in_index;
      n = z2.avail_in;
      b = that.bitb;
      k = that.bitk;
      q = that.write;
      m = /* (int) */
      q < that.read ? that.read - q - 1 : that.end - q;
      while (true) {
        switch (mode) {
          case TYPE:
            while (k < 3) {
              if (n !== 0) {
                r = Z_OK;
              } else {
                that.bitb = b;
                that.bitk = k;
                z2.avail_in = n;
                z2.total_in += p - z2.next_in_index;
                z2.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z2, r);
              }
              n--;
              b |= (z2.read_byte(p++) & 255) << k;
              k += 8;
            }
            t = /* (int) */
            b & 7;
            last = t & 1;
            switch (t >>> 1) {
              case 0:
                b >>>= 3;
                k -= 3;
                t = k & 7;
                b >>>= t;
                k -= t;
                mode = LENS;
                break;
              case 1:
                var bl = [];
                var bd = [];
                var tl = [[]];
                var td = [[]];
                InfTree.inflate_trees_fixed(bl, bd, tl, td);
                codes.init(bl[0], bd[0], tl[0], 0, td[0], 0);
                b >>>= 3;
                k -= 3;
                mode = CODES;
                break;
              case 2:
                b >>>= 3;
                k -= 3;
                mode = TABLE;
                break;
              case 3:
                b >>>= 3;
                k -= 3;
                mode = BADBLOCKS;
                z2.msg = "invalid block type";
                r = Z_DATA_ERROR;
                that.bitb = b;
                that.bitk = k;
                z2.avail_in = n;
                z2.total_in += p - z2.next_in_index;
                z2.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z2, r);
            }
            break;
          case LENS:
            while (k < 32) {
              if (n !== 0) {
                r = Z_OK;
              } else {
                that.bitb = b;
                that.bitk = k;
                z2.avail_in = n;
                z2.total_in += p - z2.next_in_index;
                z2.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z2, r);
              }
              n--;
              b |= (z2.read_byte(p++) & 255) << k;
              k += 8;
            }
            if ((~b >>> 16 & 65535) != (b & 65535)) {
              mode = BADBLOCKS;
              z2.msg = "invalid stored block lengths";
              r = Z_DATA_ERROR;
              that.bitb = b;
              that.bitk = k;
              z2.avail_in = n;
              z2.total_in += p - z2.next_in_index;
              z2.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z2, r);
            }
            left = b & 65535;
            b = k = 0;
            mode = left !== 0 ? STORED : last !== 0 ? DRY : TYPE;
            break;
          case STORED:
            if (n === 0) {
              that.bitb = b;
              that.bitk = k;
              z2.avail_in = n;
              z2.total_in += p - z2.next_in_index;
              z2.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z2, r);
            }
            if (m === 0) {
              if (q == that.end && that.read !== 0) {
                q = 0;
                m = /* (int) */
                q < that.read ? that.read - q - 1 : that.end - q;
              }
              if (m === 0) {
                that.write = q;
                r = that.inflate_flush(z2, r);
                q = that.write;
                m = /* (int) */
                q < that.read ? that.read - q - 1 : that.end - q;
                if (q == that.end && that.read !== 0) {
                  q = 0;
                  m = /* (int) */
                  q < that.read ? that.read - q - 1 : that.end - q;
                }
                if (m === 0) {
                  that.bitb = b;
                  that.bitk = k;
                  z2.avail_in = n;
                  z2.total_in += p - z2.next_in_index;
                  z2.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z2, r);
                }
              }
            }
            r = Z_OK;
            t = left;
            if (t > n)
              t = n;
            if (t > m)
              t = m;
            that.window.set(z2.read_buf(p, t), q);
            p += t;
            n -= t;
            q += t;
            m -= t;
            if ((left -= t) !== 0)
              break;
            mode = last !== 0 ? DRY : TYPE;
            break;
          case TABLE:
            while (k < 14) {
              if (n !== 0) {
                r = Z_OK;
              } else {
                that.bitb = b;
                that.bitk = k;
                z2.avail_in = n;
                z2.total_in += p - z2.next_in_index;
                z2.next_in_index = p;
                that.write = q;
                return that.inflate_flush(z2, r);
              }
              n--;
              b |= (z2.read_byte(p++) & 255) << k;
              k += 8;
            }
            table = t = b & 16383;
            if ((t & 31) > 29 || (t >> 5 & 31) > 29) {
              mode = BADBLOCKS;
              z2.msg = "too many length or distance symbols";
              r = Z_DATA_ERROR;
              that.bitb = b;
              that.bitk = k;
              z2.avail_in = n;
              z2.total_in += p - z2.next_in_index;
              z2.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z2, r);
            }
            t = 258 + (t & 31) + (t >> 5 & 31);
            if (!blens || blens.length < t) {
              blens = [];
            } else {
              for (i = 0; i < t; i++) {
                blens[i] = 0;
              }
            }
            b >>>= 14;
            k -= 14;
            index = 0;
            mode = BTREE;
          /* falls through */
          case BTREE:
            while (index < 4 + (table >>> 10)) {
              while (k < 3) {
                if (n !== 0) {
                  r = Z_OK;
                } else {
                  that.bitb = b;
                  that.bitk = k;
                  z2.avail_in = n;
                  z2.total_in += p - z2.next_in_index;
                  z2.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z2, r);
                }
                n--;
                b |= (z2.read_byte(p++) & 255) << k;
                k += 8;
              }
              blens[border[index++]] = b & 7;
              b >>>= 3;
              k -= 3;
            }
            while (index < 19) {
              blens[border[index++]] = 0;
            }
            bb[0] = 7;
            t = inftree.inflate_trees_bits(blens, bb, tb, hufts, z2);
            if (t != Z_OK) {
              r = t;
              if (r == Z_DATA_ERROR) {
                blens = null;
                mode = BADBLOCKS;
              }
              that.bitb = b;
              that.bitk = k;
              z2.avail_in = n;
              z2.total_in += p - z2.next_in_index;
              z2.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z2, r);
            }
            index = 0;
            mode = DTREE;
          /* falls through */
          case DTREE:
            while (true) {
              t = table;
              if (!(index < 258 + (t & 31) + (t >> 5 & 31))) {
                break;
              }
              var j, c;
              t = bb[0];
              while (k < t) {
                if (n !== 0) {
                  r = Z_OK;
                } else {
                  that.bitb = b;
                  that.bitk = k;
                  z2.avail_in = n;
                  z2.total_in += p - z2.next_in_index;
                  z2.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z2, r);
                }
                n--;
                b |= (z2.read_byte(p++) & 255) << k;
                k += 8;
              }
              t = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 1];
              c = hufts[(tb[0] + (b & inflate_mask[t])) * 3 + 2];
              if (c < 16) {
                b >>>= t;
                k -= t;
                blens[index++] = c;
              } else {
                i = c == 18 ? 7 : c - 14;
                j = c == 18 ? 11 : 3;
                while (k < t + i) {
                  if (n !== 0) {
                    r = Z_OK;
                  } else {
                    that.bitb = b;
                    that.bitk = k;
                    z2.avail_in = n;
                    z2.total_in += p - z2.next_in_index;
                    z2.next_in_index = p;
                    that.write = q;
                    return that.inflate_flush(z2, r);
                  }
                  n--;
                  b |= (z2.read_byte(p++) & 255) << k;
                  k += 8;
                }
                b >>>= t;
                k -= t;
                j += b & inflate_mask[i];
                b >>>= i;
                k -= i;
                i = index;
                t = table;
                if (i + j > 258 + (t & 31) + (t >> 5 & 31) || c == 16 && i < 1) {
                  blens = null;
                  mode = BADBLOCKS;
                  z2.msg = "invalid bit length repeat";
                  r = Z_DATA_ERROR;
                  that.bitb = b;
                  that.bitk = k;
                  z2.avail_in = n;
                  z2.total_in += p - z2.next_in_index;
                  z2.next_in_index = p;
                  that.write = q;
                  return that.inflate_flush(z2, r);
                }
                c = c == 16 ? blens[i - 1] : 0;
                do {
                  blens[i++] = c;
                } while (--j !== 0);
                index = i;
              }
            }
            tb[0] = -1;
            var bl_ = [];
            var bd_ = [];
            var tl_ = [];
            var td_ = [];
            bl_[0] = 9;
            bd_[0] = 6;
            t = table;
            t = inftree.inflate_trees_dynamic(257 + (t & 31), 1 + (t >> 5 & 31), blens, bl_, bd_, tl_, td_, hufts, z2);
            if (t != Z_OK) {
              if (t == Z_DATA_ERROR) {
                blens = null;
                mode = BADBLOCKS;
              }
              r = t;
              that.bitb = b;
              that.bitk = k;
              z2.avail_in = n;
              z2.total_in += p - z2.next_in_index;
              z2.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z2, r);
            }
            codes.init(bl_[0], bd_[0], hufts, tl_[0], hufts, td_[0]);
            mode = CODES;
          /* falls through */
          case CODES:
            that.bitb = b;
            that.bitk = k;
            z2.avail_in = n;
            z2.total_in += p - z2.next_in_index;
            z2.next_in_index = p;
            that.write = q;
            if ((r = codes.proc(that, z2, r)) != Z_STREAM_END) {
              return that.inflate_flush(z2, r);
            }
            r = Z_OK;
            codes.free(z2);
            p = z2.next_in_index;
            n = z2.avail_in;
            b = that.bitb;
            k = that.bitk;
            q = that.write;
            m = /* (int) */
            q < that.read ? that.read - q - 1 : that.end - q;
            if (last === 0) {
              mode = TYPE;
              break;
            }
            mode = DRY;
          /* falls through */
          case DRY:
            that.write = q;
            r = that.inflate_flush(z2, r);
            q = that.write;
            m = /* (int) */
            q < that.read ? that.read - q - 1 : that.end - q;
            if (that.read != that.write) {
              that.bitb = b;
              that.bitk = k;
              z2.avail_in = n;
              z2.total_in += p - z2.next_in_index;
              z2.next_in_index = p;
              that.write = q;
              return that.inflate_flush(z2, r);
            }
            mode = DONELOCKS;
          /* falls through */
          case DONELOCKS:
            r = Z_STREAM_END;
            that.bitb = b;
            that.bitk = k;
            z2.avail_in = n;
            z2.total_in += p - z2.next_in_index;
            z2.next_in_index = p;
            that.write = q;
            return that.inflate_flush(z2, r);
          case BADBLOCKS:
            r = Z_DATA_ERROR;
            that.bitb = b;
            that.bitk = k;
            z2.avail_in = n;
            z2.total_in += p - z2.next_in_index;
            z2.next_in_index = p;
            that.write = q;
            return that.inflate_flush(z2, r);
          default:
            r = Z_STREAM_ERROR;
            that.bitb = b;
            that.bitk = k;
            z2.avail_in = n;
            z2.total_in += p - z2.next_in_index;
            z2.next_in_index = p;
            that.write = q;
            return that.inflate_flush(z2, r);
        }
      }
    };
    that.free = function(z2) {
      that.reset(z2, null);
      that.window = null;
      hufts = null;
    };
    that.set_dictionary = function(d, start, n) {
      that.window.set(d.subarray(start, start + n), 0);
      that.read = that.write = n;
    };
    that.sync_point = function() {
      return mode == LENS ? 1 : 0;
    };
  }
  var PRESET_DICT = 32;
  var Z_DEFLATED = 8;
  var METHOD = 0;
  var FLAG = 1;
  var DICT4 = 2;
  var DICT3 = 3;
  var DICT2 = 4;
  var DICT1 = 5;
  var DICT0 = 6;
  var BLOCKS = 7;
  var DONE = 12;
  var BAD = 13;
  var mark = [0, 0, 255, 255];
  function Inflate2() {
    var that = this;
    that.mode = 0;
    that.method = 0;
    that.was = [0];
    that.need = 0;
    that.marker = 0;
    that.wbits = 0;
    function inflateReset(z) {
      if (!z || !z.istate)
        return Z_STREAM_ERROR;
      z.total_in = z.total_out = 0;
      z.msg = null;
      z.istate.mode = BLOCKS;
      z.istate.blocks.reset(z, null);
      return Z_OK;
    }
    that.inflateEnd = function(z) {
      if (that.blocks)
        that.blocks.free(z);
      that.blocks = null;
      return Z_OK;
    };
    that.inflateInit = function(z, w) {
      z.msg = null;
      that.blocks = null;
      if (w < 8 || w > 15) {
        that.inflateEnd(z);
        return Z_STREAM_ERROR;
      }
      that.wbits = w;
      z.istate.blocks = new InfBlocks(z, 1 << w);
      inflateReset(z);
      return Z_OK;
    };
    that.inflate = function(z, f) {
      var r;
      var b;
      if (!z || !z.istate || !z.next_in)
        return Z_STREAM_ERROR;
      f = f == Z_FINISH ? Z_BUF_ERROR : Z_OK;
      r = Z_BUF_ERROR;
      while (true) {
        switch (z.istate.mode) {
          case METHOD:
            if (z.avail_in === 0)
              return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            if (((z.istate.method = z.read_byte(z.next_in_index++)) & 15) != Z_DEFLATED) {
              z.istate.mode = BAD;
              z.msg = "unknown compression method";
              z.istate.marker = 5;
              break;
            }
            if ((z.istate.method >> 4) + 8 > z.istate.wbits) {
              z.istate.mode = BAD;
              z.msg = "invalid window size";
              z.istate.marker = 5;
              break;
            }
            z.istate.mode = FLAG;
          /* falls through */
          case FLAG:
            if (z.avail_in === 0)
              return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            b = z.read_byte(z.next_in_index++) & 255;
            if (((z.istate.method << 8) + b) % 31 !== 0) {
              z.istate.mode = BAD;
              z.msg = "incorrect header check";
              z.istate.marker = 5;
              break;
            }
            if ((b & PRESET_DICT) === 0) {
              z.istate.mode = BLOCKS;
              break;
            }
            z.istate.mode = DICT4;
          /* falls through */
          case DICT4:
            if (z.avail_in === 0)
              return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            z.istate.need = (z.read_byte(z.next_in_index++) & 255) << 24 & 4278190080;
            z.istate.mode = DICT3;
          /* falls through */
          case DICT3:
            if (z.avail_in === 0)
              return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            z.istate.need += (z.read_byte(z.next_in_index++) & 255) << 16 & 16711680;
            z.istate.mode = DICT2;
          /* falls through */
          case DICT2:
            if (z.avail_in === 0)
              return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            z.istate.need += (z.read_byte(z.next_in_index++) & 255) << 8 & 65280;
            z.istate.mode = DICT1;
          /* falls through */
          case DICT1:
            if (z.avail_in === 0)
              return r;
            r = f;
            z.avail_in--;
            z.total_in++;
            z.istate.need += z.read_byte(z.next_in_index++) & 255;
            z.istate.mode = DICT0;
            return Z_NEED_DICT;
          case DICT0:
            z.istate.mode = BAD;
            z.msg = "need dictionary";
            z.istate.marker = 0;
            return Z_STREAM_ERROR;
          case BLOCKS:
            r = z.istate.blocks.proc(z, r);
            if (r == Z_DATA_ERROR) {
              z.istate.mode = BAD;
              z.istate.marker = 0;
              break;
            }
            if (r == Z_OK) {
              r = f;
            }
            if (r != Z_STREAM_END) {
              return r;
            }
            r = f;
            z.istate.blocks.reset(z, z.istate.was);
            z.istate.mode = DONE;
          /* falls through */
          case DONE:
            return Z_STREAM_END;
          case BAD:
            return Z_DATA_ERROR;
          default:
            return Z_STREAM_ERROR;
        }
      }
    };
    that.inflateSetDictionary = function(z, dictionary, dictLength) {
      var index = 0;
      var length = dictLength;
      if (!z || !z.istate || z.istate.mode != DICT0)
        return Z_STREAM_ERROR;
      if (length >= 1 << z.istate.wbits) {
        length = (1 << z.istate.wbits) - 1;
        index = dictLength - length;
      }
      z.istate.blocks.set_dictionary(dictionary, index, length);
      z.istate.mode = BLOCKS;
      return Z_OK;
    };
    that.inflateSync = function(z) {
      var n;
      var p;
      var m;
      var r, w;
      if (!z || !z.istate)
        return Z_STREAM_ERROR;
      if (z.istate.mode != BAD) {
        z.istate.mode = BAD;
        z.istate.marker = 0;
      }
      if ((n = z.avail_in) === 0)
        return Z_BUF_ERROR;
      p = z.next_in_index;
      m = z.istate.marker;
      while (n !== 0 && m < 4) {
        if (z.read_byte(p) == mark[m]) {
          m++;
        } else if (z.read_byte(p) !== 0) {
          m = 0;
        } else {
          m = 4 - m;
        }
        p++;
        n--;
      }
      z.total_in += p - z.next_in_index;
      z.next_in_index = p;
      z.avail_in = n;
      z.istate.marker = m;
      if (m != 4) {
        return Z_DATA_ERROR;
      }
      r = z.total_in;
      w = z.total_out;
      inflateReset(z);
      z.total_in = r;
      z.total_out = w;
      z.istate.mode = BLOCKS;
      return Z_OK;
    };
    that.inflateSyncPoint = function(z) {
      if (!z || !z.istate || !z.istate.blocks)
        return Z_STREAM_ERROR;
      return z.istate.blocks.sync_point();
    };
  }
  function ZStream() {
  }
  ZStream.prototype = {
    inflateInit: function(bits) {
      var that = this;
      that.istate = new Inflate2();
      if (!bits)
        bits = MAX_BITS;
      return that.istate.inflateInit(that, bits);
    },
    inflate: function(f) {
      var that = this;
      if (!that.istate)
        return Z_STREAM_ERROR;
      return that.istate.inflate(that, f);
    },
    inflateEnd: function() {
      var that = this;
      if (!that.istate)
        return Z_STREAM_ERROR;
      var ret = that.istate.inflateEnd(that);
      that.istate = null;
      return ret;
    },
    inflateSync: function() {
      var that = this;
      if (!that.istate)
        return Z_STREAM_ERROR;
      return that.istate.inflateSync(that);
    },
    inflateSetDictionary: function(dictionary, dictLength) {
      var that = this;
      if (!that.istate)
        return Z_STREAM_ERROR;
      return that.istate.inflateSetDictionary(that, dictionary, dictLength);
    },
    read_byte: function(start) {
      var that = this;
      return that.next_in.subarray(start, start + 1)[0];
    },
    read_buf: function(start, size) {
      var that = this;
      return that.next_in.subarray(start, start + size);
    }
  };
  function Inflater() {
    var that = this;
    var z = new ZStream();
    var bufsize = 512;
    var flush = Z_NO_FLUSH;
    var buf = new Uint8Array(bufsize);
    var nomoreinput = false;
    z.inflateInit();
    z.next_out = buf;
    that.append = function(data, onprogress) {
      var err, buffers = [], lastIndex = 0, bufferIndex = 0, bufferSize = 0, array;
      if (data.length === 0)
        return;
      z.next_in_index = 0;
      z.next_in = data;
      z.avail_in = data.length;
      do {
        z.next_out_index = 0;
        z.avail_out = bufsize;
        if (z.avail_in === 0 && !nomoreinput) {
          z.next_in_index = 0;
          nomoreinput = true;
        }
        err = z.inflate(flush);
        if (nomoreinput && err == Z_BUF_ERROR)
          return -1;
        if (err != Z_OK && err != Z_STREAM_END)
          throw "inflating: " + z.msg;
        if ((nomoreinput || err == Z_STREAM_END) && z.avail_in == data.length)
          return -1;
        if (z.next_out_index)
          if (z.next_out_index == bufsize)
            buffers.push(new Uint8Array(buf));
          else
            buffers.push(new Uint8Array(buf.subarray(0, z.next_out_index)));
        bufferSize += z.next_out_index;
        if (onprogress && z.next_in_index > 0 && z.next_in_index != lastIndex) {
          onprogress(z.next_in_index);
          lastIndex = z.next_in_index;
        }
      } while (z.avail_in > 0 || z.avail_out === 0);
      array = new Uint8Array(bufferSize);
      buffers.forEach(function(chunk) {
        array.set(chunk, bufferIndex);
        bufferIndex += chunk.length;
      });
      return array;
    };
    that.flush = function() {
      z.inflateEnd();
    };
  }
  return Inflater;
})();

var Zip = (function() {
  var ERR_BAD_FORMAT = "File format is not recognized.";
  var ERR_ENCRYPTED = "File contains encrypted entry.";
  var ERR_ZIP64 = "File is using Zip64 (4gb+ file size).";
  var ERR_READ = "Error while reading zip file.";
  var ERR_WRITE = "Error while writing zip file.";
  var ERR_WRITE_DATA = "Error while writing file data.";
  var ERR_READ_DATA = "Error while reading file data.";
  var ERR_DUPLICATED_NAME = "File already exists.";
  var CHUNK_SIZE = 512 * 1024;
  var TEXT_PLAIN = "text/plain";
  var appendABViewSupported;
  try {
    appendABViewSupported = new Blob([new DataView(new ArrayBuffer(0))]).size === 0;
  } catch (e) {
  }
  function Crc32() {
    var crc = -1, that = this;
    that.append = function(data) {
      var offset, table = that.table;
      for (offset = 0; offset < data.length; offset++)
        crc = crc >>> 8 ^ table[(crc ^ data[offset]) & 255];
    };
    that.get = function() {
      return ~crc;
    };
  }
  Crc32.prototype.table = (function() {
    var i, j, t, table = [];
    for (i = 0; i < 256; i++) {
      t = i;
      for (j = 0; j < 8; j++)
        if (t & 1)
          t = t >>> 1 ^ 3988292384;
        else
          t = t >>> 1;
      table[i] = t;
    }
    return table;
  })();
  function blobSlice(blob, index, length) {
    if (blob.slice)
      return blob.slice(index, index + length);
    else if (blob.webkitSlice)
      return blob.webkitSlice(index, index + length);
    else if (blob.mozSlice)
      return blob.mozSlice(index, index + length);
    else if (blob.msSlice)
      return blob.msSlice(index, index + length);
  }
  function getDataHelper(byteLength, bytes) {
    var dataBuffer, dataArray;
    dataBuffer = new ArrayBuffer(byteLength);
    dataArray = new Uint8Array(dataBuffer);
    if (bytes)
      dataArray.set(bytes, 0);
    return {
      buffer: dataBuffer,
      array: dataArray,
      view: new DataView(dataBuffer)
    };
  }
  function Reader() {
  }
  function TextReader(text) {
    var that = this, blobReader;
    function init(callback, onerror) {
      var blob = new Blob([text], {
        type: TEXT_PLAIN
      });
      blobReader = new BlobReader(blob);
      blobReader.init(function() {
        that.size = blobReader.size;
        callback();
      }, onerror);
    }
    function readUint8Array(index, length, callback, onerror) {
      blobReader.readUint8Array(index, length, callback, onerror);
    }
    that.size = 0;
    that.init = init;
    that.readUint8Array = readUint8Array;
  }
  TextReader.prototype = new Reader();
  TextReader.prototype.constructor = TextReader;
  function Data64URIReader(dataURI) {
    var that = this, dataStart;
    function init(callback) {
      var dataEnd = dataURI.length;
      while (dataURI.charAt(dataEnd - 1) == "=")
        dataEnd--;
      dataStart = dataURI.indexOf(",") + 1;
      that.size = Math.floor((dataEnd - dataStart) * 0.75);
      callback();
    }
    function readUint8Array(index, length, callback) {
      var i, data = getDataHelper(length);
      var start = Math.floor(index / 3) * 4;
      var end = Math.ceil((index + length) / 3) * 4;
      var bytes = atob(dataURI.substring(start + dataStart, end + dataStart));
      var delta = index - Math.floor(start / 4) * 3;
      for (i = delta; i < delta + length; i++)
        data.array[i - delta] = bytes.charCodeAt(i);
      callback(data.array);
    }
    that.size = 0;
    that.init = init;
    that.readUint8Array = readUint8Array;
  }
  Data64URIReader.prototype = new Reader();
  Data64URIReader.prototype.constructor = Data64URIReader;
  function BlobReader(blob) {
    var that = this;
    function init(callback) {
      that.size = blob.size;
      callback();
    }
    function readUint8Array(index, length, callback, onerror) {
      var reader = new FileReader();
      reader.onload = function(e) {
        callback(new Uint8Array(e.target.result));
      };
      reader.onerror = onerror;
      reader.readAsArrayBuffer(blobSlice(blob, index, length));
    }
    that.size = 0;
    that.init = init;
    that.readUint8Array = readUint8Array;
  }
  BlobReader.prototype = new Reader();
  BlobReader.prototype.constructor = BlobReader;
  function Writer() {
  }
  Writer.prototype.getData = function(callback) {
    callback(this.data);
  };
  function TextWriter(encoding) {
    var that = this, blob;
    function init(callback) {
      blob = new Blob([], {
        type: TEXT_PLAIN
      });
      callback();
    }
    function writeUint8Array(array, callback) {
      blob = new Blob([blob, appendABViewSupported ? array : array.buffer], {
        type: TEXT_PLAIN
      });
      callback();
    }
    function getData(callback, onerror) {
      var reader = new FileReader();
      reader.onload = function(e) {
        callback(e.target.result);
      };
      reader.onerror = onerror;
      reader.readAsText(blob, encoding);
    }
    that.init = init;
    that.writeUint8Array = writeUint8Array;
    that.getData = getData;
  }
  TextWriter.prototype = new Writer();
  TextWriter.prototype.constructor = TextWriter;
  function Data64URIWriter(contentType) {
    var that = this, data = "", pending = "";
    function init(callback) {
      data += "data:" + (contentType || "") + ";base64,";
      callback();
    }
    function writeUint8Array(array, callback) {
      var i, delta = pending.length, dataString = pending;
      pending = "";
      for (i = 0; i < Math.floor((delta + array.length) / 3) * 3 - delta; i++)
        dataString += String.fromCharCode(array[i]);
      for (; i < array.length; i++)
        pending += String.fromCharCode(array[i]);
      if (dataString.length > 2)
        data += btoa(dataString);
      else
        pending = dataString;
      callback();
    }
    function getData(callback) {
      callback(data + btoa(pending));
    }
    that.init = init;
    that.writeUint8Array = writeUint8Array;
    that.getData = getData;
  }
  Data64URIWriter.prototype = new Writer();
  Data64URIWriter.prototype.constructor = Data64URIWriter;
  function BlobWriter(contentType) {
    var blob, that = this;
    function init(callback) {
      blob = new Blob([], {
        type: contentType
      });
      callback();
    }
    function writeUint8Array(array, callback) {
      blob = new Blob([blob, appendABViewSupported ? array : array.buffer], {
        type: contentType
      });
      callback();
    }
    function getData(callback) {
      callback(blob);
    }
    that.init = init;
    that.writeUint8Array = writeUint8Array;
    that.getData = getData;
  }
  BlobWriter.prototype = new Writer();
  BlobWriter.prototype.constructor = BlobWriter;
  function launchProcess(process, reader, writer, offset, size, onappend, onprogress, onend, onreaderror, onwriteerror) {
    var chunkIndex = 0, index, outputSize = 0;
    function step() {
      var outputData;
      index = chunkIndex * CHUNK_SIZE;
      if (index < size) {
        reader.readUint8Array(offset + index, Math.min(CHUNK_SIZE, size - index), function(inputData) {
          var outputData2 = process.append(inputData, function() {
            if (onprogress)
              onprogress(offset + index, size);
          });
          outputSize += outputData2.length;
          onappend(true, inputData);
          writer.writeUint8Array(outputData2, function() {
            onappend(false, outputData2);
            chunkIndex++;
            setTimeout(step, 1);
          }, onwriteerror);
          if (onprogress)
            onprogress(index, size);
        }, onreaderror);
      } else {
        outputData = process.flush();
        if (outputData) {
          outputSize += outputData.length;
          writer.writeUint8Array(outputData, function() {
            onappend(false, outputData);
            onend(outputSize);
          }, onwriteerror);
        } else
          onend(outputSize);
      }
    }
    step();
  }
  function inflate(reader, writer, offset, size, computeCrc32, onend, onprogress, onreaderror, onwriteerror) {
    var worker, crc32 = new Crc32();
    function oninflateappend(sending, array) {
      if (computeCrc32 && !sending)
        crc32.append(array);
    }
    function oninflateend(outputSize) {
      onend(outputSize, crc32.get());
    }
    {
      launchProcess(new zip.Inflater(), reader, writer, offset, size, oninflateappend, onprogress, oninflateend, onreaderror, onwriteerror);
    }
    return worker;
  }
  function deflate(reader, writer, level, onend, onprogress, onreaderror, onwriteerror) {
    var worker, crc32 = new Crc32();
    function ondeflateappend(sending, array) {
      if (sending)
        crc32.append(array);
    }
    function ondeflateend(outputSize) {
      onend(outputSize, crc32.get());
    }
    {
      launchProcess(new zip.Deflater(), reader, writer, 0, reader.size, ondeflateappend, onprogress, ondeflateend, onreaderror, onwriteerror);
    }
    return worker;
  }
  function copy(reader, writer, offset, size, computeCrc32, onend, onprogress, onreaderror, onwriteerror) {
    var chunkIndex = 0, crc32 = new Crc32();
    function step() {
      var index = chunkIndex * CHUNK_SIZE;
      if (index < size)
        reader.readUint8Array(offset + index, Math.min(CHUNK_SIZE, size - index), function(array) {
          if (computeCrc32)
            crc32.append(array);
          if (onprogress)
            onprogress(index, size, array);
          writer.writeUint8Array(array, function() {
            chunkIndex++;
            step();
          }, onwriteerror);
        }, onreaderror);
      else
        onend(size, crc32.get());
    }
    step();
  }
  function decodeASCII(str) {
    var i, out = "", charCode, extendedASCII = [
      "\xC7",
      "\xFC",
      "\xE9",
      "\xE2",
      "\xE4",
      "\xE0",
      "\xE5",
      "\xE7",
      "\xEA",
      "\xEB",
      "\xE8",
      "\xEF",
      "\xEE",
      "\xEC",
      "\xC4",
      "\xC5",
      "\xC9",
      "\xE6",
      "\xC6",
      "\xF4",
      "\xF6",
      "\xF2",
      "\xFB",
      "\xF9",
      "\xFF",
      "\xD6",
      "\xDC",
      "\xF8",
      "\xA3",
      "\xD8",
      "\xD7",
      "\u0192",
      "\xE1",
      "\xED",
      "\xF3",
      "\xFA",
      "\xF1",
      "\xD1",
      "\xAA",
      "\xBA",
      "\xBF",
      "\xAE",
      "\xAC",
      "\xBD",
      "\xBC",
      "\xA1",
      "\xAB",
      "\xBB",
      "_",
      "_",
      "_",
      "\xA6",
      "\xA6",
      "\xC1",
      "\xC2",
      "\xC0",
      "\xA9",
      "\xA6",
      "\xA6",
      "+",
      "+",
      "\xA2",
      "\xA5",
      "+",
      "+",
      "-",
      "-",
      "+",
      "-",
      "+",
      "\xE3",
      "\xC3",
      "+",
      "+",
      "-",
      "-",
      "\xA6",
      "-",
      "+",
      "\xA4",
      "\xF0",
      "\xD0",
      "\xCA",
      "\xCB",
      "\xC8",
      "i",
      "\xCD",
      "\xCE",
      "\xCF",
      "+",
      "+",
      "_",
      "_",
      "\xA6",
      "\xCC",
      "_",
      "\xD3",
      "\xDF",
      "\xD4",
      "\xD2",
      "\xF5",
      "\xD5",
      "\xB5",
      "\xFE",
      "\xDE",
      "\xDA",
      "\xDB",
      "\xD9",
      "\xFD",
      "\xDD",
      "\xAF",
      "\xB4",
      "\xAD",
      "\xB1",
      "_",
      "\xBE",
      "\xB6",
      "\xA7",
      "\xF7",
      "\xB8",
      "\xB0",
      "\xA8",
      "\xB7",
      "\xB9",
      "\xB3",
      "\xB2",
      "_",
      " "
    ];
    for (i = 0; i < str.length; i++) {
      charCode = str.charCodeAt(i) & 255;
      if (charCode > 127)
        out += extendedASCII[charCode - 128];
      else
        out += String.fromCharCode(charCode);
    }
    return out;
  }
  function decodeUTF8(string) {
    return decodeURIComponent(escape(string));
  }
  function getString(bytes) {
    var i, str = "";
    for (i = 0; i < bytes.length; i++)
      str += String.fromCharCode(bytes[i]);
    return str;
  }
  function getDate(timeRaw) {
    var date = (timeRaw & 4294901760) >> 16, time = timeRaw & 65535;
    try {
      return new Date(
        1980 + ((date & 65024) >> 9),
        ((date & 480) >> 5) - 1,
        date & 31,
        (time & 63488) >> 11,
        (time & 2016) >> 5,
        (time & 31) * 2,
        0
      );
    } catch (e) {
    }
  }
  function readCommonHeader(entry, data, index, centralDirectory, onerror) {
    entry.version = data.view.getUint16(index, true);
    entry.bitFlag = data.view.getUint16(index + 2, true);
    entry.compressionMethod = data.view.getUint16(index + 4, true);
    entry.lastModDateRaw = data.view.getUint32(index + 6, true);
    entry.lastModDate = getDate(entry.lastModDateRaw);
    if ((entry.bitFlag & 1) === 1) {
      onerror(ERR_ENCRYPTED);
      return;
    }
    if (centralDirectory || (entry.bitFlag & 8) != 8) {
      entry.crc32 = data.view.getUint32(index + 10, true);
      entry.compressedSize = data.view.getUint32(index + 14, true);
      entry.uncompressedSize = data.view.getUint32(index + 18, true);
    }
    if (entry.compressedSize === 4294967295 || entry.uncompressedSize === 4294967295) {
      onerror(ERR_ZIP64);
      return;
    }
    entry.filenameLength = data.view.getUint16(index + 22, true);
    entry.extraFieldLength = data.view.getUint16(index + 24, true);
  }
  function createZipReader(reader, onerror) {
    function Entry() {
    }
    Entry.prototype.getData = function(writer, onend, onprogress, checkCrc32) {
      var that = this, worker;
      function terminate(callback, param) {
        if (worker)
          worker.terminate();
        worker = null;
        if (callback)
          callback(param);
      }
      function testCrc32(crc32) {
        var dataCrc32 = getDataHelper(4);
        dataCrc32.view.setUint32(0, crc32);
        return that.crc32 == dataCrc32.view.getUint32(0);
      }
      function getWriterData(uncompressedSize, crc32) {
        if (checkCrc32 && !testCrc32(crc32))
          onreaderror();
        else
          writer.getData(function(data) {
            terminate(onend, data);
          });
      }
      function onreaderror() {
        terminate(onerror, ERR_READ_DATA);
      }
      function onwriteerror() {
        terminate(onerror, ERR_WRITE_DATA);
      }
      reader.readUint8Array(that.offset, 30, function(bytes) {
        var data = getDataHelper(bytes.length, bytes), dataOffset;
        if (data.view.getUint32(0) != 1347093252) {
          onerror(ERR_BAD_FORMAT);
          return;
        }
        readCommonHeader(that, data, 4, false, onerror);
        dataOffset = that.offset + 30 + that.filenameLength + that.extraFieldLength;
        writer.init(function() {
          if (that.compressionMethod === 0)
            copy(reader, writer, dataOffset, that.compressedSize, checkCrc32, getWriterData, onprogress, onreaderror, onwriteerror);
          else
            worker = inflate(reader, writer, dataOffset, that.compressedSize, checkCrc32, getWriterData, onprogress, onreaderror, onwriteerror);
        }, onwriteerror);
      }, onreaderror);
    };
    function seekEOCDR(offset, entriesCallback) {
      reader.readUint8Array(reader.size - offset, offset, function(bytes) {
        var dataView = getDataHelper(bytes.length, bytes).view;
        if (dataView.getUint32(0) != 1347093766) {
          seekEOCDR(offset + 1, entriesCallback);
        } else {
          entriesCallback(dataView);
        }
      }, function() {
        onerror(ERR_READ);
      });
    }
    return {
      getEntries: function(callback) {
        if (reader.size < 22) {
          onerror(ERR_BAD_FORMAT);
          return;
        }
        seekEOCDR(22, function(dataView) {
          var datalength, fileslength;
          datalength = dataView.getUint32(16, true);
          fileslength = dataView.getUint16(8, true);
          reader.readUint8Array(datalength, reader.size - datalength, function(bytes) {
            var i, index = 0, entries = [], entry, filename, comment, data = getDataHelper(bytes.length, bytes);
            for (i = 0; i < fileslength; i++) {
              entry = new Entry();
              if (data.view.getUint32(index) != 1347092738) {
                onerror(ERR_BAD_FORMAT);
                return;
              }
              readCommonHeader(entry, data, index + 6, true, onerror);
              entry.commentLength = data.view.getUint16(index + 32, true);
              entry.directory = (data.view.getUint8(index + 38) & 16) == 16;
              entry.offset = data.view.getUint32(index + 42, true);
              filename = getString(data.array.subarray(index + 46, index + 46 + entry.filenameLength));
              entry.filename = (entry.bitFlag & 2048) === 2048 ? decodeUTF8(filename) : decodeASCII(filename);
              if (!entry.directory && entry.filename.charAt(entry.filename.length - 1) == "/")
                entry.directory = true;
              comment = getString(data.array.subarray(index + 46 + entry.filenameLength + entry.extraFieldLength, index + 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength));
              entry.comment = (entry.bitFlag & 2048) === 2048 ? decodeUTF8(comment) : decodeASCII(comment);
              entries.push(entry);
              index += 46 + entry.filenameLength + entry.extraFieldLength + entry.commentLength;
            }
            callback(entries);
          }, function() {
            onerror(ERR_READ);
          });
        });
      },
      close: function(callback) {
        if (callback)
          callback();
      }
    };
  }
  function encodeUTF8(string) {
    return unescape(encodeURIComponent(string));
  }
  function getBytes(str) {
    var i, array = [];
    for (i = 0; i < str.length; i++)
      array.push(str.charCodeAt(i));
    return array;
  }
  function createZipWriter(writer, onerror, dontDeflate) {
    var worker, files = {}, filenames = [], datalength = 0;
    function terminate(callback, message) {
      if (worker)
        worker.terminate();
      worker = null;
      if (callback)
        callback(message);
    }
    function onwriteerror() {
      terminate(onerror, ERR_WRITE);
    }
    function onreaderror() {
      terminate(onerror, ERR_READ_DATA);
    }
    return {
      add: function(name, reader, onend, onprogress, options) {
        var header, filename, date;
        function writeHeader(callback) {
          var data;
          date = options.lastModDate || /* @__PURE__ */ new Date();
          header = getDataHelper(26);
          files[name] = {
            headerArray: header.array,
            directory: options.directory,
            filename,
            offset: datalength,
            comment: getBytes(encodeUTF8(options.comment || ""))
          };
          header.view.setUint32(0, 335546376);
          if (options.version)
            header.view.setUint8(0, options.version);
          if (!dontDeflate && options.level !== 0 && !options.directory)
            header.view.setUint16(4, 2048);
          header.view.setUint16(6, (date.getHours() << 6 | date.getMinutes()) << 5 | date.getSeconds() / 2, true);
          header.view.setUint16(8, (date.getFullYear() - 1980 << 4 | date.getMonth() + 1) << 5 | date.getDate(), true);
          header.view.setUint16(22, filename.length, true);
          data = getDataHelper(30 + filename.length);
          data.view.setUint32(0, 1347093252);
          data.array.set(header.array, 4);
          data.array.set(filename, 30);
          datalength += data.array.length;
          writer.writeUint8Array(data.array, callback, onwriteerror);
        }
        function writeFooter(compressedLength, crc32) {
          var footer = getDataHelper(16);
          datalength += compressedLength || 0;
          footer.view.setUint32(0, 1347094280);
          if (typeof crc32 != "undefined") {
            header.view.setUint32(10, crc32, true);
            footer.view.setUint32(4, crc32, true);
          }
          if (reader) {
            footer.view.setUint32(8, compressedLength, true);
            header.view.setUint32(14, compressedLength, true);
            footer.view.setUint32(12, reader.size, true);
            header.view.setUint32(18, reader.size, true);
          }
          writer.writeUint8Array(footer.array, function() {
            datalength += 16;
            terminate(onend);
          }, onwriteerror);
        }
        function writeFile() {
          options = options || {};
          name = name.trim();
          if (options.directory && name.charAt(name.length - 1) != "/")
            name += "/";
          if (files.hasOwnProperty(name)) {
            onerror(ERR_DUPLICATED_NAME);
            return;
          }
          filename = getBytes(encodeUTF8(name));
          filenames.push(name);
          writeHeader(function() {
            if (reader) {
              if (dontDeflate || options.level === 0) {
                copy(reader, writer, 0, reader.size, true, writeFooter, onprogress, onreaderror, onwriteerror);
              } else {
                worker = deflate(reader, writer, options.level, writeFooter, onprogress, onreaderror, onwriteerror);
              }
            } else {
              writeFooter();
            }
          });
        }
        if (reader) {
          reader.init(writeFile, onreaderror);
        } else {
          writeFile();
        }
      },
      close: function(callback) {
        var data, length = 0, index = 0, indexFilename, file;
        for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
          file = files[filenames[indexFilename]];
          length += 46 + file.filename.length + file.comment.length;
        }
        data = getDataHelper(length + 22);
        for (indexFilename = 0; indexFilename < filenames.length; indexFilename++) {
          file = files[filenames[indexFilename]];
          data.view.setUint32(index, 1347092738);
          data.view.setUint16(index + 4, 5120);
          data.array.set(file.headerArray, index + 6);
          data.view.setUint16(index + 32, file.comment.length, true);
          if (file.directory)
            data.view.setUint8(index + 38, 16);
          data.view.setUint32(index + 42, file.offset, true);
          data.array.set(file.filename, index + 46);
          data.array.set(file.comment, index + 46 + file.filename.length);
          index += 46 + file.filename.length + file.comment.length;
        }
        data.view.setUint32(index, 1347093766);
        data.view.setUint16(index + 8, filenames.length, true);
        data.view.setUint16(index + 10, filenames.length, true);
        data.view.setUint32(index + 12, length, true);
        data.view.setUint32(index + 16, datalength, true);
        writer.writeUint8Array(data.array, function() {
          terminate(function() {
            writer.getData(callback);
          });
        }, onwriteerror);
      }
    };
  }
  function onerror_default(error) {
    console.error(error);
  }
  var zip = {
    Reader,
    Writer,
    BlobReader,
    Data64URIReader,
    TextReader,
    BlobWriter,
    Data64URIWriter,
    TextWriter,
    createReader: function(reader, callback, onerror) {
      onerror = onerror || onerror_default;
      reader.init(function() {
        callback(createZipReader(reader, onerror));
      }, onerror);
    },
    createWriter: function(writer, callback, onerror, dontDeflate) {
      onerror = onerror || onerror_default;
      dontDeflate = !!dontDeflate;
      writer.init(function() {
        callback(createZipWriter(writer, onerror, dontDeflate));
      }, onerror);
    },
    workerScriptsPath: "",
    useWebWorkers: false,
    //
    Deflater: Deflate,
    Inflater: Inflate
  };
  return zip;
})();

function zipBlob(fset2, callback, onerror, progress) {
  Zip.createWriter(
    new Zip.BlobWriter("application/zip"),
    function(zipWriter) {
      function __add_to_zip(fset3, i, on_end) {
        if (i >= fset3.length) return;
        var { fn, blob } = fset3[i];
        typeof progress === "function" && progress(i + 1, fset3.length, fn);
        var is_last = i === fset3.length - 1;
        var scb = is_last ? on_end : function() {
          __add_to_zip(fset3, i + 1, on_end);
        };
        zipWriter.add(fn, new Zip.BlobReader(blob), scb);
      }
      __add_to_zip(fset2, 0, function() {
        zipWriter.close(callback);
      });
    },
    onerror || function def_onerror(message) {
      console.error(message);
    }
  );
}
async function zipBlob5(fset2, progress) {
  return new Promise(function(resolve, reject) {
    zipBlob(fset2, resolve, reject, progress);
  });
}
function unzipBlob(fn, blob, callback, onerror) {
  Zip.createReader(
    new Zip.BlobReader(blob),
    function(zipReader) {
      zipReader.getEntries(function(entries) {
        for (var i = 0; i < entries.length; i++) {
          var obj = entries[i];
          if (!obj.directory && obj.filename === fn) {
            obj.getData(new Zip.BlobWriter("text/plain"), function(data) {
              zipReader.close();
              callback(data);
              return;
            });
          }
        }
        callback();
      });
    },
    onerror
  );
}
function unzipBlob5(fn, blob) {
  return new Promise(function(resolve, reject) {
    unzipBlob(fn, fset, resolve, reject);
  });
}
async function createWriter() {
  function error_handle(message) {
  }
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    Zip.createWriter(new Zip.BlobWriter("application/zip"), function(zipWriter) {
      zipWriter["error_handle"] = error_handle;
      resolve(zipWriter);
    }, error_handle.handle);
  });
}
async function addToZip(writer, dat) {
  let { fn, blob } = dat;
  let { error_handle } = writer;
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    writer.add(fn, new Zip.BlobReader(blob), function() {
      resolve();
    });
  });
}
async function closeWriter(writer) {
  let { error_handle } = writer;
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    writer.close(function(zippedBlob) {
      resolve(zippedBlob);
    });
  });
}
async function createReader(blob) {
  function error_handle(message) {
  }
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    Zip.createReader(new Zip.BlobReader(blob), function(zipReader) {
      zipReader["error_handle"] = error_handle;
      resolve(zipReader);
    }, error_handle.handle);
  });
}
async function getFileEntries(reader, filter) {
  let { error_handle } = reader;
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    reader.getEntries(function(entries) {
      resolve(typeof filter === "function" ? entries.filter(filter) : entries);
    });
  });
}
async function getEntryData(reader, entry) {
  let { error_handle } = reader;
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    if (!entry.directory) {
      entry.getData(new Zip.BlobWriter(), function(data) {
        resolve(data);
      });
    } else {
      reject("Can not getData from a directory entry.");
    }
  });
}
async function closeReader(reader) {
  let { error_handle } = reader;
  return new Promise(function(resolve, reject) {
    error_handle.handle = reject;
    resolve(reader.close());
  });
}

export { addToZip, closeReader, closeWriter, createReader, createWriter, getEntryData, getFileEntries, unzipBlob, unzipBlob5, zipBlob, zipBlob5 };
