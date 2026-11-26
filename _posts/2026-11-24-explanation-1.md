---
title: "이화픽 상품 목록 페이지의 필터링과 페이지네이션 구현"
excerpt: "Flask와 Firebase를 활용하여 상품 정보를 조회하고, 할인 유형과 카테고리에 따른 필터링 및 페이지네이션을 구현한 과정을 설명합니다."
date: 2026-11-26 12:00:00 +0900
author: "윤한솔"
categories:
  - Explanation
tags:
  - 이화픽
  - Flask
  - Firebase
  - Jinja2
  - 필터링
  - 페이지네이션
---

## 배경 (Context)

이화픽(EWHA PICK)은 이화인을 위한 마감 할인 상품 사전 결제 및 픽업 마켓이다. 주변 가게의 사장님이 할인 상품을 등록하면 학생들은 웹사이트를 통해 원하는 상품을 확인하고 선택할 수 있다.

상품 목록 페이지는 학생들이 여러 가게의 할인 상품을 탐색하는 대표적인 페이지이다. 상품의 개수가 증가할수록 모든 상품을 한 화면에 나열하는 방식은 사용자가 원하는 상품을 찾기 어렵게 만들 수 있다.

이를 해결하기 위해 할인 유형과 상품 카테고리에 따른 필터링 기능을 적용하고, 상품 목록을 여러 페이지로 나누어 제공하도록 구현하였다. 또한 Firebase에 저장된 상품 정보를 Flask 서버에서 가공하여 사용자에게 필요한 정보를 효율적으로 전달하고자 하였다.

이 글에서는 이화픽의 상품 목록 페이지를 중심으로 데이터베이스에 저장된 상품이 사용자 화면에 표시되기까지의 구조와 동작 방식을 설명한다.

## 기능 소개 (Goal)

상품 목록 페이지에서는 가게에서 등록한 상품의 이미지, 이름, 할인 유형, 할인율, 할인 적용 가격 및 가게 이름을 확인할 수 있다.

사용자는 마감 할인과 이화인 할인 중 원하는 할인 유형을 선택하거나 베이커리, 도시락, 카페, 분식 등의 카테고리를 선택하여 상품 목록을 필터링할 수 있다. 두 가지 조건을 동시에 적용하는 것도 가능하다.

한 페이지에는 최대 네 개의 상품이 표시되며, 페이지 하단의 번호 또는 화살표를 이용하여 다른 상품 목록으로 이동할 수 있다.

이 기능의 주요 구현 목표는 다음과 같다.

- Firebase에 저장된 상품 정보를 동적으로 조회한다.
- 할인 유형과 카테고리에 따른 필터링을 제공한다.
- 페이지네이션을 통해 상품 목록을 나누어 표시한다.
- 페이지 이동 시 사용자가 선택한 필터링 조건을 유지한다.
- 상품의 할인 적용 가격과 가게 이름을 표시한다.

## 구현 과정 (Steps)

### 화면 구성

상품 목록 페이지는 할인 유형 선택 영역, 카테고리 선택 영역, 상품 카드 영역, 페이지네이션 영역으로 구성된다.

![상품 목록 전체 화면]({{ '/assets/images/explanation-1/product-list.png' | relative_url }})
*그림 1. 이화픽 상품 목록 페이지의 전체 구성*

할인 유형 선택 영역에서는 전체, 마감 할인, 이화인 할인 중 하나를 선택할 수 있다. 카테고리 선택 영역에서는 전체, 베이커리, 도시락, 카페, 분식 중 하나를 선택할 수 있다.

상품 카드에는 상품의 대표 이미지와 할인 정보, 가게 이름 등이 표시된다. 상품 카드를 선택하면 해당 상품의 상세 페이지로 이동할 수 있다.

상품 목록 페이지를 구현하는 데 사용된 주요 파일은 다음과 같다.

| 파일 | 역할 |
|---|---|
| `app.py` | 사용자 요청 처리, 필터링, 페이지네이션 및 데이터 가공 |
| `database.py` | Firebase의 상품 및 사용자 정보 조회 |
| `product_list.html` | Jinja2를 활용한 상품 목록 및 메뉴 출력 |
| `product_list.css` | 상품 카드, 필터링 메뉴 및 페이지 디자인 |

Flask는 사용자 요청을 처리하는 백엔드 역할을 담당하며, Firebase Realtime Database는 상품 및 사용자 정보를 저장한다. Jinja2는 서버에서 전달받은 데이터를 HTML 화면에 동적으로 표시하는 데 사용된다.

### 동작 흐름

상품 목록 페이지는 다음과 같은 순서로 동작한다.

1. 사용자가 상품 목록 페이지에 접속하거나 필터를 선택한다.
2. Flask 서버에서 URL의 Query String을 통해 사용자의 선택 조건을 확인한다.
3. Firebase에서 전체 상품 정보를 불러온다.
4. 할인 유형과 카테고리 조건을 만족하는 상품만 추출한다.
5. 필터링된 상품을 기준으로 전체 페이지 수를 계산한다.
6. 현재 페이지에 해당하는 상품의 할인 가격과 가게 이름을 처리한다.
7. 가공된 데이터를 Jinja2 템플릿에 전달하여 화면에 표시한다.

이 과정에서 필터링을 페이지네이션보다 먼저 수행하는 것이 중요하다. 전체 상품을 먼저 페이지로 나눈 뒤 필터링하면 현재 페이지에 포함된 상품만 검사하게 되므로 원하는 상품이 다른 페이지에 존재하더라도 확인하기 어려울 수 있다.

따라서 전체 상품에서 조건에 맞는 상품을 먼저 추출하고, 그 결과를 기준으로 페이지를 구성하도록 구현하였다.

### 핵심 코드

#### 1. Firebase에서 상품 정보 조회

먼저 `database.py`의 `get_items()` 함수를 사용하여 Firebase Realtime Database에 저장된 상품 정보를 불러온다.

```python
def get_items(self):
    """item 노드 전체 {상품이름: 상품정보}. 없으면 빈 딕셔너리"""
    return self.db.child("item").get().val() or {}
```

Firebase의 `item` 노드에는 상품 이름을 키로 하여 가격, 할인율, 할인 유형, 카테고리, 판매자 ID, 이미지 경로 등의 정보가 저장되어 있다.

`child("item")`을 통해 상품 정보가 저장된 노드에 접근하고, `get().val()`을 이용하여 실제 데이터를 조회한다.

상품 정보가 존재하지 않는 경우에는 빈 딕셔너리를 반환하도록 하였다. 이를 통해 등록된 상품이 없는 상황에서도 이후 필터링 과정에서 오류가 발생하지 않도록 구성하였다.

#### 2. Query String을 활용한 필터링

`app.py`의 `product_list()` 함수에서는 사용자가 선택한 할인 유형, 카테고리 및 페이지 번호를 가져온다.

```python
@app.route("/products")
def product_list():
    discount = request.args.get("discount", "all")
    category = request.args.get("category", "all")
    page = request.args.get("page", 1, type=int)
```

Flask의 `request.args.get()`은 URL에 포함된 Query String의 값을 가져오는 데 사용된다.

| 파라미터 | 설명 | 기본값 |
|---|---|---|
| `discount` | 할인 유형 | `all` |
| `category` | 상품 카테고리 | `all` |
| `page` | 현재 페이지 번호 | `1` |

예를 들어 마감 할인 상품 중 베이커리 상품을 선택하면 다음과 같은 URL이 생성된다.

```text
/products?discount=closing&category=bakery
```

서버에서는 전달받은 조건을 이용하여 전체 상품 목록을 필터링한다.

```python
items = [
    (name, info) for name, info in DB.get_items().items()
    if (discount == "all" or info.get("discount_type") == discount)
    and (category == "all" or info.get("category") == category)
]
```

Python의 리스트 컴프리헨션을 사용하여 할인 유형과 카테고리 조건을 만족하는 상품만 새로운 리스트에 저장한다.

사용자가 전체를 선택하면 해당 조건으로 상품을 제한하지 않는다. 두 조건은 `and`로 연결되어 있으므로 할인 유형과 카테고리를 동시에 선택한 경우에는 두 조건을 모두 만족하는 상품만 표시된다.

#### 3. 페이지네이션 구현

필터링이 완료되면 현재 페이지에 표시할 상품을 추출한다.

이화픽에서는 한 페이지에 표시할 상품의 개수를 네 개로 설정하였다.

```python
ITEMS_PER_PAGE = 4
```

전체 페이지 수와 현재 페이지의 상품은 다음과 같이 계산한다.

```python
total_pages = max(1, (len(items) + ITEMS_PER_PAGE - 1) // ITEMS_PER_PAGE)
page = max(1, min(page, total_pages))
start = (page - 1) * ITEMS_PER_PAGE
page_items = items[start:start + ITEMS_PER_PAGE]
```

전체 페이지 수는 필터링된 상품의 개수를 기준으로 계산한다. `max()`를 이용하여 상품이 존재하지 않더라도 전체 페이지 수가 최소 1이 되도록 설정하였다.

또한 사용자가 요청한 페이지 번호가 유효한 범위를 벗어나는 경우 첫 번째 페이지 또는 마지막 페이지로 조정한다.

이후 리스트 슬라이싱을 이용하여 현재 페이지에 해당하는 상품만 추출한다.

예를 들어 필터링된 상품이 열 개라면 다음과 같이 나누어 표시한다.

| 페이지 | 표시할 상품 | 개수 |
|---|---|---|
| 1 | 첫 번째~네 번째 상품 | 4개 |
| 2 | 다섯 번째~여덟 번째 상품 | 4개 |
| 3 | 아홉 번째~열 번째 상품 | 2개 |

이러한 방식으로 사용자는 한 화면에서 적절한 개수의 상품을 확인하고 페이지를 이동하면서 다른 상품을 탐색할 수 있다.

#### 4. 상품 정보 가공

현재 페이지에 표시할 상품이 결정되면 상품 카드에 필요한 정보를 구성한다.

```python
store_names = {}
products = []
for name, info in page_items:
    seller_id = info.get("seller_id", "")
    if seller_id not in store_names:
        seller = DB.get_user(seller_id) or {}
        store_names[seller_id] = seller.get("store_name", seller_id)
    price = info.get("price", 0)
    rate = info.get("discount_rate", 0)
    products.append({
        "name": name,
        "image": (info.get("img_path") or [None])[0],
        "discount_type": info.get("discount_type"),
        "category": info.get("category"),
        "discount_rate": rate,
        "price": price * (100 - rate) // 100,
        "store_name": store_names[seller_id],
    })
```

상품에 저장된 판매자 ID를 이용하여 해당 판매자의 가게 이름을 조회한다. 조회한 가게 이름은 `store_names` 딕셔너리에 저장하며, 현재 페이지에 같은 판매자의 상품이 여러 개 존재하는 경우 기존 조회 결과를 재사용한다.

이를 통해 동일한 가게 정보를 반복적으로 데이터베이스에 요청하는 것을 줄일 수 있다.

할인 적용 가격은 기존 가격에 할인율을 반영하여 계산한다. 예를 들어 기존 가격이 5,000원이고 할인율이 20%라면 할인 적용 가격은 4,000원이 된다.

상품 이미지는 등록된 이미지 목록 중 첫 번째 이미지를 대표 이미지로 사용한다.

#### 5. Jinja2를 활용한 화면 출력

가공된 상품 정보는 Flask의 `render_template()`을 통해 HTML 템플릿으로 전달된다.

```python
return render_template("student/product_list/product_list.html",
                       products=products, page=page, total_pages=total_pages,
                       discount=discount, category=category)
```

`product_list.html`에서는 Jinja2 반복문을 이용하여 전달받은 상품 정보를 출력한다.

아래는 상품 카드에서 이름과 가격을 표시하는 부분을 발췌한 코드이다.

{% raw %}
```html
<h3 class="product-name">
  {{ product.name }}
</h3>

<div class="product-price">
  <span class="discount-rate">
    {{ product.discount_rate }}%
  </span>

  <span class="price">
    {{ "{:,}".format(product.price) }}원
  </span>
</div>
```
{% endraw %}

서버에서 전달한 상품 정보를 이용하므로 상품이 추가되더라도 각각의 상품 카드를 HTML에 직접 작성할 필요가 없다.

또한 가격에 천 단위 구분 기호를 적용하여 사용자가 상품 가격을 쉽게 확인할 수 있도록 하였다.

#### 6. 페이지 이동 시 필터링 상태 유지

사용자가 필터를 선택한 상태에서 다른 페이지로 이동하더라도 기존 조건이 유지되도록 구현하였다.

{% raw %}
```html
{% for n in range(1, total_pages + 1) %}
<a class="page-number{% if n == page %} active{% endif %}"
   href="{{ url_for('product_list', discount=discount, category=category, page=n) }}"
   {% if n == page %}aria-current="page"{% endif %}>{{ n }}</a>
{% endfor %}
```
{% endraw %}

`url_for()`를 통해 페이지 이동 링크를 생성할 때 현재 할인 유형과 카테고리 값을 함께 전달한다.

따라서 사용자가 특정 할인 유형이나 카테고리를 선택한 상태에서 페이지를 이동하더라도 기존 필터링 조건이 유지된다.

현재 페이지에는 `active` 클래스를 적용하여 사용자가 자신의 위치를 쉽게 확인할 수 있도록 하였다.

> 필터링 조건을 Query String에 포함하면 페이지를 이동하더라도 사용자의 선택 상태를 유지할 수 있다.

## 결과 (Result)

### 할인 유형 필터링

![할인 유형 필터링 화면]({{ '/assets/images/explanation-1/product-filter.png' | relative_url }})
*그림 2. 마감 할인 상품을 선택한 화면*

마감 할인 메뉴를 선택하면 전체 상품 중 마감 할인에 해당하는 상품만 표시된다. 선택된 할인 유형은 활성화된 메뉴를 통해 확인할 수 있다.

### 카테고리 필터링

![카테고리 필터링 화면]({{ '/assets/images/explanation-1/category-filter.png' | relative_url }})
*그림 3. 카테고리 필터링 적용 화면*

카테고리를 선택하면 해당 카테고리에 속하는 상품만 표시된다. 할인 유형과 카테고리를 함께 선택하여 원하는 상품의 범위를 좁힐 수 있다.

### 페이지네이션

![페이지네이션 화면]({{ '/assets/images/explanation-1/pagination.png' | relative_url }})
*그림 4. 상품 목록의 두 번째 페이지*

한 페이지에 최대 네 개의 상품이 표시되며, 페이지 번호 또는 화살표를 이용하여 다른 상품 목록으로 이동할 수 있다.

필터링 조건은 페이지 이동 링크에 함께 전달되므로 다른 페이지로 이동하더라도 기존 조건을 유지할 수 있다.

## 배운 점 (What I learned)

상품 목록 페이지의 구현 과정을 통해 데이터베이스에서 조회한 정보를 사용자에게 필요한 형태로 가공하고, 이를 프론트엔드에 전달하는 전체적인 웹 서비스의 동작 구조를 이해할 수 있었다.

특히 필터링과 페이지네이션을 함께 구현할 때 데이터 처리 순서가 중요하며, Query String을 이용하면 페이지 이동 시에도 사용자의 선택 상태를 유지할 수 있다는 점을 배웠다.

또한 동일한 가게 정보를 재사용하여 불필요한 데이터베이스 요청을 줄이는 코드를 살펴보면서, 기능 구현뿐만 아니라 효율적인 데이터 처리와 사용자 편의성도 함께 고려해야 한다는 것을 알게 되었다.

## 참고 자료 (References)

- Open Software Platform, Lecture 11. Web Application (3) — 필터링 및 페이지 이동 시 선택 상태 유지
- [Flask 공식 문서](https://flask.palletsprojects.com/) — 사용자 요청 처리 및 HTML 템플릿 렌더링
- [Firebase Realtime Database 공식 문서](https://firebase.google.com/docs/database) — 데이터베이스 구조 및 데이터 조회
- [Jinja 공식 문서](https://jinja.palletsprojects.com/) — 템플릿 반복문 및 조건문