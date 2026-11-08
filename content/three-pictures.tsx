import { M, Tex } from "@/components/Tex";
import { Figure } from "@/components/ui";
import { ColumnPicture2D, ColumnPicture3D, EqMatrixMap, MatVec, RowPicture2D, RowPicture3D } from "@/components/viz";

export const toc = [
  { id: "intro", label: "세 가지 그림" },
  { id: "row-2d", label: "2×2 행 그림" },
  { id: "col-2d", label: "2×2 열 그림" },
  { id: "row-3d", label: "3×3 행 그림" },
  { id: "col-3d", label: "3×3 열 그림" },
  { id: "every-b", label: "모든 b에 대해 풀 수 있을까?" },
  { id: "ax", label: "행렬 × 벡터" },
  { id: "summary", label: "정리" },
];

export default function ThreePictures() {
  return (
    <>
      <h2 id="intro">세 가지 그림</h2>
      <p>
        선형대수의 출발점은 <strong>연립일차방정식을 푸는 것</strong>입니다. 가장 깔끔한 경우, 즉 방정식이 n개이고
        미지수도 n개인 경우부터 시작합니다. 같은 방정식을 세 가지 방식으로 바라볼 수 있습니다.
      </p>
      <ul>
        <li>
          <strong>행 그림 (row picture)</strong> — 방정식 하나하나를 직선이나 평면으로 보고, 그것들이 만나는 점을
          찾습니다.
        </li>
        <li>
          <strong>열 그림 (column picture)</strong> — 행렬의 열벡터들을 몇 배씩 더해야(일차결합) b가 되는지 찾습니다.
        </li>
        <li>
          <strong>행렬 형태</strong> — 모든 것을 <Tex>{"Ax = b"}</Tex> 한 줄로 씁니다.
        </li>
      </ul>
      <p>세 가지는 서로 다른 문제가 아니라 같은 문제를 다른 자리에서 본 것입니다. 이 글은 그 연결을 그림으로 확인합니다.</p>

      <h2 id="row-2d">2×2 행 그림</h2>
      <p>가장 작은 예제로 방정식 두 개, 미지수 두 개부터 봅시다.</p>
      <EqMatrixMap
        A={[
          [2, -1],
          [-1, 2],
        ]}
        b={[0, 3]}
      />
      <p>
        식을 행렬로 옮기는 규칙은 단순합니다. <strong>i번째 방정식은 A의 i번째 행</strong>이 되고,{" "}
        <span className="tx-c1">x의 계수들</span>은 A의 1열, <span className="tx-c2">y의 계수들</span>은 A의 2열,{" "}
        <span className="tx-b">우변</span>은 b가 됩니다. 식에서 생략된 <Tex>{"1"}</Tex>(예: <Tex>{"-y"}</Tex>의{" "}
        <Tex>{"-1"}</Tex>)도 행렬에는 빠짐없이 들어갑니다.
      </p>
      <p>
        행 그림에서는 각 <strong>행(방정식)</strong>이 평면 위의 직선 하나입니다. 첫 번째 식 <Tex>{"2x - y = 0"}</Tex>은
        원점을 지나는 직선 <Tex>{"y = 2x"}</Tex>이고, 두 번째 식 <Tex>{"-x + 2y = 3"}</Tex>은 <Tex>{"(-3, 0)"}</Tex>과{" "}
        <Tex>{"(-1, 1)"}</Tex>을 지나는 직선입니다. 두 식을 모두 만족하는 점은 두 직선이 만나는 곳,{" "}
        <Tex>{"(x, y) = (1, 2)"}</Tex>입니다. 실제로 넣어 보면 <Tex>{"2\\cdot1 - 2 = 0"}</Tex>,{" "}
        <Tex>{"-1 + 2\\cdot2 = 3"}</Tex>으로 둘 다 맞습니다.
      </p>

      <Figure
        title="행 그림 — 두 직선의 교점"
        caption={
          <>
            직선에 마우스를 올리면 굵어집니다. 잡고 끌면 기울기는 그대로인 채 평행이동하고(= 그 식의 우변 b가
            바뀜), 교점(해)이 따라 움직입니다.
          </>
        }
      >
        <RowPicture2D />
      </Figure>

      <h2 id="col-2d">2×2 열 그림</h2>
      <p>이번에는 같은 방정식을 <strong>열</strong> 단위로 읽습니다. x에 곱해지는 수끼리, y에 곱해지는 수끼리 묶으면</p>
      <M>{"\\htmlClass{tx-c1}{x \\begin{bmatrix} 2 \\\\ -1 \\end{bmatrix}} + \\htmlClass{tx-c2}{y \\begin{bmatrix} -1 \\\\ 2 \\end{bmatrix}} = \\htmlClass{tx-b}{\\begin{bmatrix} 0 \\\\ 3 \\end{bmatrix}}"}</M>
      <p>
        질문이 바뀌었습니다. &ldquo;두 직선이 어디서 만나는가?&rdquo;가 아니라 &ldquo;첫 번째 열을 <Tex>x</Tex>배, 두
        번째 열을 <Tex>y</Tex>배 해서 더하면 <Tex>b</Tex>가 되는 <Tex>{"x, y"}</Tex>는?&rdquo;입니다. 이렇게 벡터에 수를
        곱해 더하는 것을 <strong>일차결합 (linear combination)</strong>이라 하고, 선형대수 전체를 관통하는 개념입니다.
        답은 행 그림과 똑같이 <Tex>{"x = 1,\\ y = 2"}</Tex>입니다. 첫 번째 열 1개와 두 번째 열 2개를 더하면
      </p>
      <M>{"1\\begin{bmatrix} 2 \\\\ -1 \\end{bmatrix} + 2\\begin{bmatrix} -1 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 2 - 2 \\\\ -1 + 4 \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 3 \\end{bmatrix}"}</M>

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
        그렇다면 가능한 <strong>모든</strong> <Tex>{"x, y"}</Tex>에 대한 조합을 모으면 무엇이 될까요? 이 예제의 두 열은
        서로 다른 방향을 가리키므로, 조합은 <strong>평면 전체</strong>를 채웁니다. 그래서 어떤 b든 만들 수 있습니다.
        반면 두 열이 같은 직선 위에 있다면, 아무리 섞어도 그 직선 밖으로 나갈 수 없습니다.
      </p>

      <h2 id="row-3d">3×3 행 그림</h2>
      <p>이제 3차원입니다. 미지수가 세 개, 방정식이 세 개입니다.</p>
      <EqMatrixMap
        A={[
          [2, -1, 0],
          [-1, 2, -1],
          [0, -3, 4],
        ]}
        b={[0, -1, 4]}
      />
      <p>
        첫 번째 식에는 <Tex>z</Tex>가 없지만, 행렬에서는 그 자리에 <Tex>0</Tex>이 들어갑니다. 흐리게 표시된{" "}
        <Tex>{"0z"}</Tex>가 행렬의 1행 3열 <Tex>0</Tex>입니다.
      </p>
      <p>
        3차원에서 일차방정식 하나는 <strong>평면</strong>입니다. 평면 두 개는 보통 한 <strong>직선</strong>에서
        만나고, 세 번째 평면이 그 직선을 한 <strong>점</strong>에서 자릅니다. 그 점이 해입니다. 평면 세 개를 종이에
        그리면 알아보기 어렵지만, 아래 그림은 돌려 가며 볼 수 있습니다.
      </p>

      <Figure
        title="행 그림 (3D) — 세 평면의 교점"
        caption={
          <>
            마우스로 돌려가며 세 평면이 <Tex>{"(0, 0, 1)"}</Tex>에서 만나는 것을 확인하세요. 진한 선은 두 평면씩의
            교선입니다. 평면을 잡고 끌면 기울기는 그대로 평행이동하고(= 그 식의 우변 b가 바뀜), 교점이 따라
            움직입니다.
          </>
        }
      >
        <RowPicture3D />
      </Figure>

      <p>
        차원이 4, 5, …, n으로 올라가면 행 그림은 금방 상상할 수 없게 됩니다. 4차원 공간의 &ldquo;평면&rdquo; 네 개가
        만나는 모습은 그릴 방법이 없습니다. 반면 열 그림은 차원이 올라가도 &ldquo;벡터 n개를 섞어서 b를 만든다&rdquo;는
        같은 문장으로 생각할 수 있습니다. 그래서 앞으로는 주로 열 그림으로 생각하게 됩니다.
      </p>

      <h2 id="col-3d">3×3 열 그림</h2>
      <M>{"\\htmlClass{tx-c1}{x \\begin{bmatrix} 2 \\\\ -1 \\\\ 0 \\end{bmatrix}} + \\htmlClass{tx-c2}{y \\begin{bmatrix} -1 \\\\ 2 \\\\ -3 \\end{bmatrix}} + \\htmlClass{tx-c3}{z \\begin{bmatrix} 0 \\\\ -1 \\\\ 4 \\end{bmatrix}} = \\htmlClass{tx-b}{\\begin{bmatrix} 0 \\\\ -1 \\\\ 4 \\end{bmatrix}}"}</M>
      <p>
        3차원 공간의 벡터 세 개를 섞어서 b를 만드는 문제입니다. 이 예제는 일부러 쉽게 골랐습니다. b가 바로 세 번째
        열이므로, 첫 번째·두 번째 열은 쓰지 않고 세 번째 열을 한 번 쓰면 됩니다. 따라서{" "}
        <Tex>{"x = 0,\\ y = 0,\\ z = 1"}</Tex>이고, 행 그림에서 세 평면이 만나던 바로 그 점입니다.
      </p>

      <Figure
        title="열 그림 (3D) — 세 열벡터의 일차결합"
        caption={
          <>
            분홍 점 b를 잡고 끌면 x, y, z가 자동으로 계산되어 세 화살표가 꼬리에 머리를 잇듯 b까지 연결됩니다. b는
            화면과 나란한 평면(원점을 지남) 위에서 움직이므로, 다른 방향으로 옮기려면 그래프를 돌린 뒤 끌어 보세요.
            처음 상태에서는 b가 세 번째 열과 같아서 초록 화살표 하나만 보입니다.
          </>
        }
      >
        <ColumnPicture3D />
      </Figure>

      <h2 id="every-b">모든 b에 대해 풀 수 있을까?</h2>
      <p>
        이제 핵심 질문입니다. <strong>어떤 우변 b가 와도 <Tex>{"Ax = b"}</Tex>를 풀 수 있는가?</strong> 열 그림의
        언어로 바꾸면 다음과 같습니다.
      </p>
      <M>{"\\text{열들의 모든 일차결합이 3차원 공간 전체를 채우는가?}"}</M>
      <p>
        위의 행렬 A에서는 <strong>예</strong>입니다. 그림에서 b를 어디로 끌어도 세 화살표가 따라왔습니다. 그러면 언제
        실패할까요? 세 열이 <strong>같은 평면 위에</strong> 있을 때입니다. 예를 들어 세 번째 열이 첫 번째와 두 번째 열의
        합이라면, 세 번째 열은 새로운 방향을 전혀 보태지 못합니다. 조합은 그 평면 안에 갇히고, 평면 밖의 b에는 영원히
        도달할 수 없습니다. 이런 행렬을 <strong>특이 (singular)</strong> 행렬이라고 합니다. 반대로 모든 b에 대해 해가
        정확히 하나씩 있는 행렬은 <strong>가역 (invertible)</strong>이라고 합니다.
      </p>
      <Figure
        title="특이한 경우 — a₃ = a₁ + a₂"
        caption={
          <>
            위와 같은 그림인데 세 번째 열만 <Tex>{"a_3 = a_1 + a_2"}</Tex>로 바꿨습니다. 세 열이 모두 회색 평면 위에 있어서,
            조합은 평면 밖으로 나갈 수 없습니다. b를 끌어 보면 점선이 &ldquo;닿지 못한 거리&rdquo;를 보여줍니다. 아무렇게나
            옮긴 b는 거의 항상 평면 밖에 있고, 회색 평면에 가까이 가져가야만 달라붙으며 점선이 사라집니다.
          </>
        }
      >
        <ColumnPicture3D singular />
      </Figure>
      <p>
        같은 이야기가 더 높은 차원에서도 그대로 성립합니다. 9차원 벡터 9개가 서로 &ldquo;독립&rdquo;이면, 즉 어느 것도
        나머지의 조합으로 만들어지지 않으면, 그 조합은 9차원 전체를 채웁니다. 하지만 아홉 번째 열이 여덟 번째와 같다면
        새 방향이 하나 모자라서, 9차원 안의 &ldquo;8차원 평면&rdquo;만 채웁니다. 눈으로 볼 수는 없지만, 3차원에서 본
        그림이 그대로 일반화됩니다.
      </p>

      <h2 id="ax">행렬 × 벡터: 두 가지 방법</h2>
      <p>
        마지막으로 <Tex>{"Ax"}</Tex>를 실제로 어떻게 계산하는지 봅니다. 예제는
      </p>
      <M>{"\\begin{bmatrix} 2 & 5 \\\\ 1 & 3 \\end{bmatrix} \\begin{bmatrix} 1 \\\\ 2 \\end{bmatrix} = \\begin{bmatrix} 12 \\\\ 7 \\end{bmatrix}"}</M>
      <ul>
        <li>
          <strong>열 방식</strong>: 첫 번째 열 1개 + 두 번째 열 2개.{" "}
          <Tex>{"1\\begin{bmatrix} 2 \\\\ 1 \\end{bmatrix} + 2\\begin{bmatrix} 5 \\\\ 3 \\end{bmatrix} = \\begin{bmatrix} 12 \\\\ 7 \\end{bmatrix}"}</Tex>
        </li>
        <li>
          <strong>행 방식</strong>: 각 행과 x의 <strong>내적 (dot product)</strong>.{" "}
          <Tex>{"2\\cdot1 + 5\\cdot2 = 12"}</Tex>, <Tex>{"1\\cdot1 + 3\\cdot2 = 7"}</Tex>
        </li>
      </ul>

      <Figure title="Ax 계산 — 열 방식과 행 방식" caption="x를 바꿔 보세요. 두 방식은 항상 같은 결과를 내지만, 열 방식이 'Ax는 A의 열들의 일차결합'이라는 핵심을 보여줍니다.">
        <MatVec />
      </Figure>

      <h2 id="summary">정리</h2>
      <div className="my-4 rounded-xl border border-accent/30 bg-accent/5 p-5">
        <p className="!mt-0 font-semibold">
          <Tex>{"Ax"}</Tex>는 A의 열들의 일차결합이다
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
        남은 질문은 해를 <strong>체계적으로</strong> 찾는 방법입니다. 그 답이 식에서 미지수를 하나씩 지워 나가는{" "}
        <strong>소거법 (elimination)</strong>입니다.
      </p>
    </>
  );
}
