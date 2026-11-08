export const PLAYLIST_ID = "PL49CF3715CB9EF31D";

export type Lecture = {
  slug: string;
  num: string;
  title: string;
  titleKo: string;
  videoId: string;
  /** 노트(인터랙티브 콘텐츠)가 작성되었는지 */
  ready?: boolean;
};

const raw: [string, string, string, string][] = [
  ["1", "The Geometry of Linear Equations", "선형방정식의 기하학", "ZK3O402wf1c"],
  ["2", "Elimination with Matrices", "행렬을 이용한 소거법", "QVKj3LADCnA"],
  ["3", "Multiplication and Inverse Matrices", "행렬 곱셈과 역행렬", "FX4C-JpTFgY"],
  ["4", "Factorization into A = LU", "A = LU 분해", "5hO3MrzPa0A"],
  ["5", "Transposes, Permutations, Spaces R^n", "전치, 치환, 벡터공간 Rⁿ", "JibVXBElKL0"],
  ["6", "Column Space and Nullspace", "열공간과 영공간", "8o5Cmfpeo6g"],
  ["7", "Solving Ax = 0: Pivot Variables, Special Solutions", "Ax = 0 풀기: 피벗 변수와 특수해", "VqP2tREMvt0"],
  ["8", "Solving Ax = b: Row Reduced Form R", "Ax = b 풀기: 기약행사다리꼴 R", "9Q1q7s1jTzU"],
  ["9", "Independence, Basis, and Dimension", "일차독립, 기저, 차원", "yjBerM5jWsc"],
  ["10", "The Four Fundamental Subspaces", "네 가지 기본 부분공간", "nHlE7EgJFds"],
  ["11", "Matrix Spaces; Rank 1; Small World Graphs", "행렬공간, 랭크 1, 좁은 세상 그래프", "2IdtqGM6KWU"],
  ["12", "Graphs, Networks, Incidence Matrices", "그래프, 네트워크, 결합행렬", "6-wh6yvk6uc"],
  ["13", "Quiz 1 Review", "퀴즈 1 복습", "l88D4r74gtM"],
  ["14", "Orthogonal Vectors and Subspaces", "직교 벡터와 부분공간", "YzZUIYRCE38"],
  ["15", "Projections onto Subspaces", "부분공간으로의 투영", "Y_Ac6KiQ1t0"],
  ["16", "Projection Matrices and Least Squares", "투영행렬과 최소제곱", "osh80YCg_GM"],
  ["17", "Orthogonal Matrices and Gram-Schmidt", "직교행렬과 그람-슈미트", "uNsCkP9mgRk"],
  ["18", "Properties of Determinants", "행렬식의 성질", "srxexLishgY"],
  ["19", "Determinant Formulas and Cofactors", "행렬식 공식과 여인수", "23LLB9mNJvc"],
  ["20", "Cramer's Rule, Inverse Matrix, and Volume", "크래머 공식, 역행렬, 부피", "QNpj-gOXW9M"],
  ["21", "Eigenvalues and Eigenvectors", "고윳값과 고유벡터", "lXNXrLcoerU"],
  ["22", "Diagonalization and Powers of A", "대각화와 A의 거듭제곱", "13r9QY6cmjc"],
  ["23", "Differential Equations and exp(At)", "미분방정식과 exp(At)", "IZqwi0wJovM"],
  ["24", "Markov Matrices; Fourier Series", "마르코프 행렬, 푸리에 급수", "8MF3pz-oYHo"],
  ["24b", "Quiz 2 Review", "퀴즈 2 복습", "sFxA8eIS6tA"],
  ["25", "Symmetric Matrices and Positive Definiteness", "대칭행렬과 양의 정부호", "umt6BB1nJ4w"],
  ["26", "Complex Matrices; Fast Fourier Transform", "복소행렬, 고속 푸리에 변환", "M0Sa8fLOajA"],
  ["27", "Positive Definite Matrices and Minima", "양의 정부호 행렬과 극소", "vF7eyJ2g3kU"],
  ["28", "Similar Matrices and Jordan Form", "닮은 행렬과 조르당 형식", "z_zYQHmrh08"],
  ["29", "Singular Value Decomposition", "특잇값 분해 (SVD)", "Nx0lRBaXoz4"],
  ["30", "Linear Transformations and Their Matrices", "선형변환과 그 행렬", "Ts3o2I8_Mxc"],
  ["31", "Change of Basis; Image Compression", "기저 변환, 이미지 압축", "vGkn-3NFGck"],
  ["32", "Quiz 3 Review", "퀴즈 3 복습", "HgC1l_6ySkc"],
  ["33", "Left and Right Inverses; Pseudoinverse", "좌·우 역행렬, 유사역행렬", "Go2aLo7ZOlU"],
  ["34", "Final Course Review", "기말 총정리", "RWvi4Vx4CDc"],
];

const READY = new Set(["1"]);

export const lectures: Lecture[] = raw.map(([num, title, titleKo, videoId]) => ({
  slug: `lec-${num.padStart(2, "0")}`,
  num,
  title,
  titleKo,
  videoId,
  ready: READY.has(num),
}));

export function getLecture(slug: string) {
  const i = lectures.findIndex((l) => l.slug === slug);
  if (i < 0) return null;
  return { lecture: lectures[i], prev: lectures[i - 1] ?? null, next: lectures[i + 1] ?? null };
}
