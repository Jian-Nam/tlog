import { M, Tex } from "@/components/Tex";
import { Figure } from "@/components/ui";
import { T } from "@/components/VideoPlayer";
import { ColumnPicture2D, ColumnPicture3D, MatVec, RowPicture2D, RowPicture3D } from "@/components/viz";

export const toc = [
  { id: "intro", label: "선형대수의 근본 문제" },
  { id: "row-2d", label: "2×2 행 그림" },
  { id: "col-2d", label: "2×2 열 그림" },
  { id: "row-3d", label: "3×3 행 그림" },
  { id: "col-3d", label: "3×3 열 그림" },
  { id: "every-b", label: "모든 b에 대해 풀 수 있을까?" },
  { id: "ax", label: "행렬 × 벡터" },
  { id: "summary", label: "정리" },
];

export default function Lecture01() {
  return (
    <>
      <h2 id="intro">선형대수의 근본 문제</h2>
      <p>
        선형대수의 출발점은 <strong>연립일차방정식을 푸는 것</strong>입니다. 가장 깔끔한 경우인 n개의 방정식, n개의
        미지수부터 시작합니다. Strang 교수는 같은 방정식을 세 가지 방식으로 바라봅니다 <T at="1:31" />.
      </p>
      <ul>
        <li>
          <strong>행 그림 (row picture)</strong> — 방정식 하나하나를 직선/평면으로 보고, 그 교점을 찾는다.
        </li>
        <li>
          <strong>열 그림 (column picture)</strong> — 행렬의 열벡터들을 어떻게 섞어야(일차결합) b가 되는지 찾는다.
        </li>
        <li>
          <strong>행렬 형태</strong> — 모든 것을 <Tex>{"Ax = b"}</Tex> 한 줄로 쓴다 <T at="2:08" />.
        </li>
      </ul>

      <h2 id="row-2d">2×2 행 그림</h2>
      <p>
        강의의 첫 예제 <T at="4:20" />:
      </p>
      <M>{"\\begin{aligned} 2x - y &= 0 \\\\ -x + 2y &= 3 \\end{aligned} \\qquad\\Longleftrightarrow\\qquad \\underbrace{\\begin{bmatrix} 2 & -1 \\\\ -1 & 2 \\end{bmatrix}}_{A} \\underbrace{\\begin{bmatrix} x \\\\ y \\end{bmatrix}}_{\\mathbf{x}} = \\underbrace{\\begin{bmatrix} 0 \\\\ 3 \\end{bmatrix}}_{b}"}</M>
      <p>
        행 그림에서는 각 <strong>행(방정식)</strong>이 평면 위의 직선 하나입니다. 첫 번째 식은 원점을 지나는 직선,
        두 번째 식은 <Tex>{"(-3, 0)"}</Tex>과 <Tex>{"(-1, 1)"}</Tex>을 지나는 직선이고, 두 직선은{" "}
        <Tex>{"(x, y) = (1, 2)"}</Tex>에서 만납니다.
      </p>

      <Figure
        title="행 그림 — 두 직선의 교점"
        caption={
          <>
            b를 바꾸면 기울기는 그대로인 채 직선이 평행이동하고, 교점(해)이 따라 움직입니다.
          </>
        }
      >
        <RowPicture2D />
      </Figure>

      <h2 id="col-2d">2×2 열 그림</h2>
      <p>
        이번에는 같은 방정식을 <strong>열</strong> 단위로 읽습니다 <T at="8:47" />.
      </p>
      <M>{"x \\begin{bmatrix} \\color{#2f6fdf} 2 \\\\ \\color{#2f6fdf} -1 \\end{bmatrix} + y \\begin{bmatrix} \\color{#e8590c} -1 \\\\ \\color{#e8590c} 2 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 3 \\end{bmatrix}"}</M>
      <p>
        질문이 바뀌었습니다. &ldquo;두 직선이 어디서 만나는가?&rdquo;가 아니라 &ldquo;첫 번째 열을 <Tex>x</Tex>배, 두
        번째 열을 <Tex>y</Tex>배 해서 더하면 <Tex>b</Tex>가 되는 <Tex>{"x, y"}</Tex>는?&rdquo;입니다. 이것이 강의
        전체를 관통하는 개념, <strong>일차결합 (linear combination)</strong>입니다. 정답은 첫 번째 열 1개와 두 번째 열
        2개 <T at="11:59" />.
      </p>

      <Figure
        title="열 그림 — 열벡터의 일차결합으로 b 만들기"
        caption={
          <>
            b를 옮기면 그에 맞는 x, y가 자동으로 계산되어 파란 화살표(<Tex>{"x\\,a_1"}</Tex>)와 주황
            화살표(<Tex>{"y\\,a_2"}</Tex>)가 b까지 이어집니다. 평면 어디를 찍어도 항상 도달한다는 점에 주목하세요.
          </>
        }
      >
        <ColumnPicture2D />
      </Figure>

      <p>
        그렇다면 <strong>모든</strong> <Tex>{"x, y"}</Tex>에 대한 조합은 무엇을 만들까요 <T at="14:26" />? 이 예제의 두
        열은 서로 다른 방향을 가리키므로, 조합은 <strong>평면 전체</strong>를 채웁니다 <T at="15:02" />. 그래서 어떤
        b든 만들 수 있습니다. 반면 두 열이 같은 직선 위에 있다면, 조합은 그 직선만 채웁니다.
      </p>

      <h2 id="row-3d">3×3 행 그림</h2>
      <p>
        이제 3차원입니다 <T at="17:31" />. 미지수가 세 개, 방정식이 세 개:
      </p>
      <M>{"\\begin{aligned} 2x - y \\phantom{{}+0z} &= 0 \\\\ -x + 2y - z &= -1 \\\\ -3y + 4z &= 4 \\end{aligned} \\qquad A = \\begin{bmatrix} 2 & -1 & 0 \\\\ -1 & 2 & -1 \\\\ 0 & -3 & 4 \\end{bmatrix},\\quad b = \\begin{bmatrix} 0 \\\\ -1 \\\\ 4 \\end{bmatrix}"}</M>
      <p>
        3차원에서 일차방정식 하나는 <strong>평면</strong>입니다. 평면 두 개는 보통 한 <strong>직선</strong>에서
        만나고, 세 번째 평면이 그 직선을 한 <strong>점</strong>에서 자릅니다. 교수님도 칠판에 그리면서 고생하시는데{" "}
        <T at="20:11" />, 여기서는 돌려보면 됩니다.
      </p>

      <Figure
        title="행 그림 (3D) — 세 평면의 교점"
        caption={
          <>
            마우스로 돌려가며 세 평면이 <Tex>{"(0, 0, 1)"}</Tex>에서 만나는 것을 확인하세요. 진한 선은 두 평면씩의
            교선입니다. b를 바꾸면 평면이 평행이동하고 교점이 따라 움직입니다.
          </>
        }
      >
        <RowPicture3D />
      </Figure>

      <p>
        차원이 4, 5, …, n으로 올라가면 행 그림은 금방 상상할 수 없게 됩니다. 그래서 교수님은 <strong>열 그림을 더
        선호</strong>한다고 말합니다 <T at="21:59" />.
      </p>

      <h2 id="col-3d">3×3 열 그림</h2>
      <M>{"x \\begin{bmatrix} 2 \\\\ -1 \\\\ 0 \\end{bmatrix} + y \\begin{bmatrix} -1 \\\\ 2 \\\\ -3 \\end{bmatrix} + z \\begin{bmatrix} 0 \\\\ -1 \\\\ 4 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ -1 \\\\ 4 \\end{bmatrix}"}</M>
      <p>
        3차원 공간의 벡터 세 개를 섞어서 b를 만드는 문제입니다 <T at="22:57" />. 이 예제는 일부러 쉽게 만들어져서, b가
        바로 세 번째 열입니다. 따라서 <Tex>{"x = 0,\\ y = 0,\\ z = 1"}</Tex> <T at="25:02" />. 행 그림에서 세 평면이
        만나던 바로 그 점입니다.
      </p>

      <Figure
        title="열 그림 (3D) — 세 열벡터의 일차결합"
        caption={
          <>
            b를 바꾸면 x, y, z가 자동으로 계산되어 세 화살표가 꼬리에 머리를 잇듯 b까지 연결됩니다. 처음 상태에서는
            b가 세 번째 열과 같아서 초록 화살표 하나만 보입니다.
          </>
        }
      >
        <ColumnPicture3D />
      </Figure>

      <h2 id="every-b">모든 b에 대해 풀 수 있을까?</h2>
      <p>
        강의의 핵심 질문 <T at="27:55" />: <strong>어떤 우변 b가 와도 <Tex>{"Ax = b"}</Tex>를 풀 수 있는가?</strong>{" "}
        일차결합의 언어로 바꾸면 <T at="28:43" />:
      </p>
      <M>{"\\text{열들의 모든 일차결합이 3차원 공간 전체를 채우는가?}"}</M>
      <p>
        이 행렬 A에서는 <strong>예</strong>입니다. 그런데 언제 실패할까요 <T at="31:06" />? 세 열이{" "}
        <strong>같은 평면 위에</strong> 있을 때입니다. 예를 들어 세 번째 열이 첫 번째와 두 번째 열의 합이라면, 세 번째
        열은 새로운 방향을 전혀 보태지 못합니다. 조합은 그 평면 안에 갇히고, 평면 밖의 b는 영원히 도달할 수
        없습니다. 이런 행렬을 <strong>특이 (singular)</strong>, 즉 <strong>가역이 아니다</strong>라고 합니다.
      </p>
      <Figure
        title="특이한 경우 — a₃ = a₁ + a₂"
        caption={
          <>
            위와 같은 그림인데 세 번째 열만 <Tex>{"a_3 = a_1 + a_2"}</Tex>로 바꿨습니다. 세 열이 모두 회색 평면 위에 있어서,
            조합은 평면 밖으로 나갈 수 없습니다. b를 움직이면 점선이 &ldquo;닿지 못한 거리&rdquo;를 보여줍니다. b를
            평면 위로 가져와야만 점선이 사라집니다.
          </>
        }
      >
        <ColumnPicture3D singular />
      </Figure>
      <p>
        교수님은 이어서 9차원을 상상해 보자고 합니다 <T at="32:29" />. 9개의 열이 서로 &ldquo;독립&rdquo;이면 9차원 전체를
        채우고, 아홉 번째 열이 여덟 번째와 같다면 9차원 안의 &ldquo;8차원 평면&rdquo;만 채웁니다. 눈으로 볼 수는 없지만,
        3차원에서 본 그림이 그대로 일반화됩니다.
      </p>

      <h2 id="ax">행렬 × 벡터: 두 가지 방법</h2>
      <p>
        마지막으로 <Tex>{"Ax"}</Tex>를 실제로 어떻게 계산하는지 봅니다 <T at="35:49" />. 예제는
      </p>
      <M>{"\\begin{bmatrix} 2 & 5 \\\\ 1 & 3 \\end{bmatrix} \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 12 \\\\ 7 \\end{bmatrix}"}</M>
      <ul>
        <li>
          <strong>열 방식</strong> (교수님이 선호하는 방식): 첫 번째 열 1개 + 두 번째 열 2개.
        </li>
        <li>
          <strong>행 방식</strong>: 각 행과 x의 <strong>내적 (dot product)</strong> <T at="37:48" />.
        </li>
      </ul>

      <Figure title="Ax 계산 — 열 방식과 행 방식" caption="x를 바꿔 보세요. 두 방식은 항상 같은 결과를 내지만, 열 방식이 'Ax는 A의 열들의 일차결합'이라는 핵심을 보여줍니다.">
        <MatVec />
      </Figure>

      <h2 id="summary">정리</h2>
      <div className="my-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
        <p className="!mt-0 font-semibold">
          <Tex>{"Ax"}</Tex>는 A의 열들의 일차결합이다 <T at="38:24" />
        </p>
        <ul className="!mb-0">
          <li>행 그림: 방정식 = 직선/평면, 해 = 교점</li>
          <li>열 그림: 해 = b를 만드는 열들의 조합 계수</li>
          <li>
            모든 b에 대해 풀린다 ⇔ 열들의 조합이 공간 전체를 채운다 ⇔ A가 가역 (non-singular)
          </li>
          <li>열들이 한 평면(더 낮은 차원)에 갇히면 특이 행렬 → 어떤 b는 풀 수 없다</li>
        </ul>
      </div>
      <p className="text-muted">
        다음 강의에서는 해를 체계적으로 찾는 방법, <strong>소거법 (elimination)</strong>을 다룹니다.
      </p>
    </>
  );
}
