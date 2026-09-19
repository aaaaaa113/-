"use strict";

/* =========================
   設定
========================= */

const STORAGE_KEY = "enshinNoteData";

const STATUS_LABELS = {
  planned: "予定",
  completed: "完了",
  on_hold: "保留"
};

const PLAN_TYPE_LABELS = {
  transport: "移動",
  hotel: "宿泊",
  live: "ライブ",
  sightseeing: "観光",
  food: "食事",
  other: "その他"
};

const RESERVATION_LABELS = {
  reserved: "予約済",
  unreserved: "未予約",
  not_required: "予約不要"
};

/* =========================
   アプリデータ
========================= */

let appData = {
  events: [],
  people: [],
  settings: {
    theme: "dark"
  }
};

let currentEventId = null;
let deleteTargetEventId = null;
let deleteTargetPlanId = null;

/* =========================
   DOM
========================= */

const eventListElement =
  document.getElementById("event-list");

const emptyEventMessageElement =
  document.getElementById("empty-event-message");

const eventCountElement =
  document.getElementById("event-count");

const eventModalElement =
  document.getElementById("event-modal");

const memoModalElement =
  document.getElementById("memo-modal");

const planModalElement =
  document.getElementById("plan-modal");

const deletePlanModalElement =
  document.getElementById("delete-plan-modal");

const eventFormElement =
  document.getElementById("event-form");

const memoFormElement =
  document.getElementById("memo-form");

const planFormElement =
  document.getElementById("plan-form");

/* イベントフォーム */
const modalTitleElement =
  document.getElementById("modal-title");

const eventIdInput =
  document.getElementById("event-id");

const eventTitleInput =
  document.getElementById("event-title");

const eventStartDateInput =
  document.getElementById("event-start-date");

const eventEndDateInput =
  document.getElementById("event-end-date");

const eventLocationInput =
  document.getElementById("event-location");

const eventStatusInput =
  document.getElementById("event-status");

const eventColorInput =
  document.getElementById("event-color");

const colorValueElement =
  document.getElementById("color-value");

const eventMemoInput =
  document.getElementById("event-memo");

/* 詳細画面 */
const detailCoverElement =
  document.getElementById("detail-cover");

const detailEventNumberElement =
  document.getElementById("detail-event-number");

const detailEventTitleElement =
  document.getElementById("detail-event-title");

const detailEventDateElement =
  document.getElementById("detail-event-date");

const detailEventLocationElement =
  document.getElementById("detail-event-location");

const detailEventStatusElement =
  document.getElementById("detail-event-status");

const detailEventMemoElement =
  document.getElementById("detail-event-memo");

const planListElement =
  document.getElementById("plan-list");

const emptyPlanMessageElement =
  document.getElementById("empty-plan-message");

/* メモフォーム */
const memoInput =
  document.getElementById("memo-input");

/* 予定フォーム */
const planModalTitleElement =
  document.getElementById("plan-modal-title");

const planIdInput =
  document.getElementById("plan-id");

const planTitleInput =
  document.getElementById("plan-title");

const planTypeInput =
  document.getElementById("plan-type");

const planDateInput =
  document.getElementById("plan-date");

const planStartTimeInput =
  document.getElementById("plan-start-time");

const planEndTimeInput =
  document.getElementById("plan-end-time");

const normalPlanFields =
  document.getElementById("normal-plan-fields");

const hotelPlanFields =
  document.getElementById("hotel-plan-fields");

const hotelCheckinDateInput =
  document.getElementById("hotel-checkin-date");

const hotelCheckinTimeInput =
  document.getElementById("hotel-checkin-time");

const hotelCheckoutDateInput =
  document.getElementById("hotel-checkout-date");

const hotelCheckoutTimeInput =
  document.getElementById("hotel-checkout-time");

const planLocationInput =
  document.getElementById("plan-location");

const planReservationStatusInput =
  document.getElementById("plan-reservation-status");

const planReservationSiteInput =
  document.getElementById("plan-reservation-site");

const planReservationNumberInput =
  document.getElementById("plan-reservation-number");

const planAmountInput =
  document.getElementById("plan-amount");

const planMemoInput =
  document.getElementById("plan-memo");

/* =========================
   初期化
========================= */

document.addEventListener("DOMContentLoaded", () => {
  loadData();
  setupEventListeners();
  renderEvents();
});

/* =========================
   イベントリスナー
========================= */

function setupEventListeners() {
  /*
   * イベント作成
   */
  document
    .getElementById("open-create-event-button")
    .addEventListener("click", () => {
      openCreateEventModal();
    });

  document
    .getElementById("empty-create-button")
    .addEventListener("click", () => {
      openCreateEventModal();
    });

  /*
   * イベントフォーム
   */
  eventFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    saveEventFromForm();
  });

  document
    .getElementById("close-modal-button")
    .addEventListener("click", closeEventModal);

  document
    .getElementById("cancel-modal-button")
    .addEventListener("click", closeEventModal);

  /*
   * 色表示
   */
  eventColorInput.addEventListener("input", () => {
    updateColorValue();
  });

  /*
   * 下部タブ
   */
  document
    .querySelectorAll(".nav-button")
    .forEach((button) => {
      button.addEventListener("click", () => {
        switchPage(button.dataset.page);
      });
    });

  /*
   * 詳細画面
   */
  document
    .getElementById("back-to-events-button")
    .addEventListener("click", () => {
      currentEventId = null;
      switchPage("events-page");
    });

  document
    .getElementById("detail-edit-event-button")
    .addEventListener("click", () => {
      if (currentEventId) {
        openEditEventModal(currentEventId);
      }
    });

  document
    .getElementById("edit-event-memo-button")
    .addEventListener("click", () => {
      openMemoModal();
    });

  document
    .getElementById("open-create-plan-button")
    .addEventListener("click", () => {
      openCreatePlanModal();
    });

  /*
   * メモモーダル
   */
  memoFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    saveMemo();
  });

  document
    .getElementById("close-memo-modal-button")
    .addEventListener("click", closeMemoModal);

  document
    .getElementById("cancel-memo-button")
    .addEventListener("click", closeMemoModal);

  /*
   * 予定フォーム
   */
  planFormElement.addEventListener("submit", (event) => {
    event.preventDefault();
    savePlanFromForm();
  });

  document
    .getElementById("close-plan-modal-button")
    .addEventListener("click", closePlanModal);

  document
    .getElementById("cancel-plan-modal-button")
    .addEventListener("click", closePlanModal);

  /*
   * 予定削除モーダル
   */
  document
    .getElementById("close-delete-plan-modal-button")
    .addEventListener("click", closeDeletePlanModal);

  document
    .getElementById("cancel-delete-plan-button")
    .addEventListener("click", closeDeletePlanModal);

  document
    .getElementById("confirm-delete-plan-button")
    .addEventListener("click", deletePlan);

  /*
   * モーダル外側クリック
   */
  eventModalElement.addEventListener("click", (event) => {
    if (event.target === eventModalElement) {
      closeEventModal();
    }
  });

  memoModalElement.addEventListener("click", (event) => {
    if (event.target === memoModalElement) {
      closeMemoModal();
    }
  });

  planModalElement.addEventListener("click", (event) => {
    if (event.target === planModalElement) {
      closePlanModal();
    }
  });

  deletePlanModalElement.addEventListener("click", (event) => {
    if (event.target === deletePlanModalElement) {
      closeDeletePlanModal();
    }
  });

  /*
   * Escapeキー
   */
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeEventModal();
    closeMemoModal();
    closePlanModal();
    closeDeletePlanModal();
  });
}

/* =========================
   データ保存・読み込み
========================= */

function loadData() {
  const savedData =
    localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    appData = createEmptyAppData();
    return;
  }

  try {
    const parsedData = JSON.parse(savedData);

    appData = {
      events: Array.isArray(parsedData.events)
        ? parsedData.events
        : [],

      people: Array.isArray(parsedData.people)
        ? parsedData.people
        : [],

      settings: parsedData.settings || {
        theme: "dark"
      }
    };

    /*
     * Phase 1で作成したイベントに、
     * Phase 2用の配列がない場合に補う。
     */
    appData.events.forEach((event) => {
      if (!Array.isArray(event.plans)) {
        event.plans = [];
      }

      if (!Array.isArray(event.payments)) {
        event.payments = [];
      }

      if (!Array.isArray(event.shopping)) {
        event.shopping = [];
      }

      if (!event.image) {
        event.image = "";
      }
    });
  } catch (error) {
    console.error(
      "保存データの読み込みに失敗しました。",
      error
    );

    appData = createEmptyAppData();
  }
}

function createEmptyAppData() {
  return {
    events: [],
    people: [],
    settings: {
      theme: "dark"
    }
  };
}

function saveData() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appData)
  );
}

/* =========================
   イベント一覧
========================= */

function renderEvents() {
  eventListElement.innerHTML = "";

  const events = [...appData.events];

  events.sort((a, b) => {
    return (
      new Date(b.startDate || 0) -
      new Date(a.startDate || 0)
    );
  });

  eventCountElement.textContent = events.length;

  if (events.length === 0) {
    emptyEventMessageElement.classList.remove("hidden");
    return;
  }

  emptyEventMessageElement.classList.add("hidden");

  events.forEach((event) => {
    eventListElement.appendChild(
      createEventCard(event)
    );
  });
}

function createEventCard(event) {
  const card =
    document.createElement("article");

  const eventColor =
    event.color || "#245EFF";

  const statusLabel =
    STATUS_LABELS[event.status] || "準備中";

  card.className = "event-card";

  card.style.setProperty(
    "--card-color",
    eventColor
  );

  const visualArea =
    document.createElement("div");

  visualArea.className = "ticket-visual";

  if (event.image) {
    const image =
      document.createElement("img");

    image.className = "ticket-image";
    image.src = event.image;
    image.alt = `${event.title}のイベント画像`;

    visualArea.appendChild(image);
  } else {
    const placeholder =
      document.createElement("div");

    placeholder.className =
      "visual-placeholder";

    placeholder.textContent = "✦";

    visualArea.appendChild(placeholder);
  }

  const divider =
    document.createElement("div");

  divider.className = "ticket-divider";

  const info =
    document.createElement("div");

  info.className = "ticket-info";

  const number =
    document.createElement("div");

  number.className = "ticket-number";

  number.textContent =
    `EVENT No.${String(event.number).padStart(3, "0")}`;

  const title =
    document.createElement("div");

  title.className = "ticket-title";
  title.textContent =
    event.title || "名称未設定イベント";

  const meta =
    document.createElement("div");

  meta.className = "ticket-meta";

  const dateRow =
    document.createElement("div");

  dateRow.className = "ticket-meta-row";

  dateRow.innerHTML = `
    <span class="meta-icon">▣</span>
    <span>${escapeHtml(
      formatDateRange(
        event.startDate,
        event.endDate
      )
    )}</span>
  `;

  const locationRow =
    document.createElement("div");

  locationRow.className = "ticket-meta-row";

  locationRow.innerHTML = `
    <span class="meta-icon">⌖</span>
    <span>${escapeHtml(
      event.location || "場所未設定"
    )}</span>
  `;

  meta.appendChild(dateRow);
  meta.appendChild(locationRow);

  const bottom =
    document.createElement("div");

  bottom.className = "ticket-bottom";

  const status =
    document.createElement("span");

  status.className = "status-badge";

  status.innerHTML = `
    <span class="status-dot"></span>
    <span>${statusLabel}</span>
  `;

  const actions =
    document.createElement("div");

  actions.className = "card-actions";

  const editButton =
    document.createElement("button");

  editButton.type = "button";
  editButton.className =
    "card-action-button";

  editButton.textContent = "✎";
  editButton.title = "編集";

  editButton.addEventListener("click", () => {
    openEditEventModal(event.id);
  });

  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className =
    "card-action-button delete";

  deleteButton.textContent = "×";
  deleteButton.title = "削除";

  deleteButton.addEventListener("click", () => {
    deleteEvent(event.id);
  });

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  bottom.appendChild(status);
  bottom.appendChild(actions);

  info.appendChild(number);
  info.appendChild(title);
  info.appendChild(meta);
  info.appendChild(bottom);

  card.appendChild(visualArea);
  card.appendChild(divider);
  card.appendChild(info);

  /*
   * Phase 2では、カードを押すと詳細画面へ移動
   */
  card.addEventListener("click", (eventObject) => {
    if (
      eventObject.target.closest(
        ".card-action-button"
      )
    ) {
      return;
    }

    openEventDetail(event.id);
  });

  return card;
}

/* =========================
   イベント詳細
========================= */

function openEventDetail(eventId) {
  const event =
    findEventById(eventId);

  if (!event) {
    return;
  }

  currentEventId = eventId;

  renderEventDetail(event);

  switchPage("detail-page");
}

function renderEventDetail(event) {
  const eventColor =
    event.color || "#245EFF";

  const statusLabel =
    STATUS_LABELS[event.status] || "準備中";

  detailCoverElement.style.setProperty(
    "--detail-color",
    eventColor
  );

  detailEventNumberElement.textContent =
    `No.${String(event.number).padStart(3, "0")}`;

  detailEventTitleElement.textContent =
    event.title || "名称未設定イベント";

  detailEventDateElement.textContent =
    formatDateRange(
      event.startDate,
      event.endDate
    );

  detailEventLocationElement.textContent =
    event.location || "場所未設定";

  detailEventStatusElement.textContent =
    statusLabel;

  detailEventStatusElement.style.setProperty(
    "--card-color",
    eventColor
  );

  detailEventMemoElement.textContent =
    event.memo || "まだメモはありません。";

  renderPlans(event);
}

function renderPlans(event) {
  planListElement.innerHTML = "";

  const plans = Array.isArray(event.plans)
    ? [...event.plans]
    : [];

  if (plans.length === 0) {
    emptyPlanMessageElement.classList.remove("hidden");
    return;
  }

  emptyPlanMessageElement.classList.add("hidden");

  // 表示用の予定を作る
  const displayPlans = [];

  plans.forEach((plan) => {
    if (plan.type === "hotel") {
      // チェックイン
      if (plan.checkInDate) {
        displayPlans.push({
          ...plan,
          displayDate: plan.checkInDate,
          displayTime: plan.checkInTime || "",
          displayKind: "checkin"
        });
      }

      // チェックアウト
      if (plan.checkOutDate) {
        displayPlans.push({
          ...plan,
          displayDate: plan.checkOutDate,
          displayTime: plan.checkOutTime || "",
          displayKind: "checkout"
        });
      }

      return;
    }

    // 通常の予定
    displayPlans.push({
      ...plan,
      displayDate: plan.date,
      displayTime: plan.startTime || "",
      displayKind: "normal"
    });
  });

  // 日付 → 時刻の順で並べる
  displayPlans.sort((a, b) => {
    const dateA =
      `${a.displayDate || "9999-99-99"} ${a.displayTime || "99:99"}`;

    const dateB =
      `${b.displayDate || "9999-99-99"} ${b.displayTime || "99:99"}`;

    return dateA.localeCompare(dateB);
  });

  let currentDate = null;

  displayPlans.forEach((displayPlan) => {
    if (displayPlan.displayDate !== currentDate) {
      currentDate = displayPlan.displayDate;

      const dateHeader =
        document.createElement("div");

      dateHeader.className =
        "schedule-date-header";

      dateHeader.textContent =
        formatScheduleDate(
          displayPlan.displayDate
        );

      planListElement.appendChild(
        dateHeader
      );
    }

    if (displayPlan.displayKind === "checkin") {
      planListElement.appendChild(
        createHotelPlanElement(
          displayPlan,
          event
        )
      );
    } else if (
      displayPlan.displayKind === "checkout"
    ) {
      planListElement.appendChild(
        createHotelPlanElement(
          displayPlan,
          event
        )
      );
    } else {
      planListElement.appendChild(
        createPlanElement(
          displayPlan,
          event
        )
      );
    }
  });
}

function createPlanElement(plan, event) {
  const item =
    document.createElement("article");

  item.className = "plan-item";

  item.style.setProperty(
    "--detail-color",
    event.color || "#245EFF"
  );

  const time =
    document.createElement("div");

  time.className = "plan-time";

  time.innerHTML = `
    <div>${escapeHtml(
      formatTimeRange(
        plan.startTime,
        plan.endTime
      )
    )}</div>
  `;

  const content =
    document.createElement("div");

  content.className = "plan-content";

  const titleRow =
    document.createElement("div");

  titleRow.className = "plan-title-row";

  const title =
    document.createElement("h3");

  title.className = "plan-title";
  title.textContent =
    plan.title || "名称未設定";

  const typeBadge =
    document.createElement("span");

  typeBadge.className =
    `plan-type-badge ${
      plan.type === "hotel"
        ? "hotel"
        : ""
    }`;

  typeBadge.textContent =
    PLAN_TYPE_LABELS[plan.type] || "その他";

  titleRow.appendChild(title);
  titleRow.appendChild(typeBadge);

  const meta =
    document.createElement("div");

  meta.className = "plan-meta";

  if (plan.location) {
    const location =
      document.createElement("span");

    location.textContent =
      `⌖ ${plan.location}`;

    meta.appendChild(location);
  }

  if (plan.reservationSite) {
    const site =
      document.createElement("span");

    site.textContent =
      `予約サイト：${plan.reservationSite}`;

    meta.appendChild(site);
  }

  if (plan.reservationNumber) {
    const number =
      document.createElement("span");

    number.textContent =
      `予約番号：${plan.reservationNumber}`;

    meta.appendChild(number);
  }

  const reservation =
    document.createElement("div");

  reservation.className =
    "plan-reservation";

  const reservationBadge =
    document.createElement("span");

  const reservationClass =
    getReservationClass(
      plan.reservationStatus
    );

  reservationBadge.className =
    `reservation-badge ${reservationClass}`;

  reservationBadge.textContent =
    RESERVATION_LABELS[
      plan.reservationStatus
    ] || "未予約";

  reservation.appendChild(
    reservationBadge
  );

  const memo =
    document.createElement("p");

  memo.className = "plan-memo";

  memo.textContent =
    plan.memo || "";

  if (!plan.memo) {
    memo.classList.add("hidden");
  }

  const bottom =
    document.createElement("div");

  bottom.className = "plan-bottom";

  const amount =
    document.createElement("span");

  amount.className = "plan-amount";

  if (
    plan.amount !== null &&
    plan.amount !== undefined &&
    plan.amount !== ""
  ) {
    amount.textContent =
      `¥${Number(plan.amount).toLocaleString("ja-JP")}`;
  } else {
    amount.textContent = "";
  }

  const actions =
    document.createElement("div");

  actions.className = "plan-actions";

  const editButton =
    document.createElement("button");

  editButton.type = "button";
  editButton.className =
    "plan-action-button";

  editButton.textContent = "編集";

  editButton.addEventListener("click", () => {
    openEditPlanModal(plan.id);
  });

  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";
  deleteButton.className =
    "plan-action-button delete";

  deleteButton.textContent = "削除";

  deleteButton.addEventListener("click", () => {
    openDeletePlanModal(plan.id);
  });

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  bottom.appendChild(amount);
  bottom.appendChild(actions);

  content.appendChild(titleRow);
  content.appendChild(meta);
  content.appendChild(reservation);
  content.appendChild(memo);
  content.appendChild(bottom);

  item.appendChild(time);
  item.appendChild(content);

  return item;
}

function createHotelPlanElement(plan, event) {
  const item =
    document.createElement("article");

  item.className = "plan-item";

  item.style.setProperty(
    "--detail-color",
    event.color || "#245EFF"
  );

  // 時刻
  const time =
    document.createElement("div");

  time.className = "plan-time";

  time.innerHTML = `
    <div>${escapeHtml(
      plan.displayTime || "--:--"
    )}</div>
  `;

  // 内容
  const content =
    document.createElement("div");

  content.className =
    "plan-content";

  // タイトル＋タグ
  const titleRow =
    document.createElement("div");

  titleRow.className =
    "plan-title-row";

  const title =
    document.createElement("h3");

  title.className =
    "plan-title";

  title.textContent =
    plan.title || "宿泊";

  const typeBadge =
    document.createElement("span");

  typeBadge.className =
    "plan-type-badge hotel";

  typeBadge.textContent =
    plan.displayKind === "checkin"
      ? "チェックイン"
      : "チェックアウト";

  titleRow.appendChild(title);
  titleRow.appendChild(typeBadge);

  // 場所・予約情報
  const meta =
    document.createElement("div");

  meta.className =
    "plan-meta";

  if (plan.location) {
    const location =
      document.createElement("span");

    location.textContent =
      `⌖ ${plan.location}`;

    meta.appendChild(location);
  }

  if (plan.reservationSite) {
    const site =
      document.createElement("span");

    site.textContent =
      `予約サイト：${plan.reservationSite}`;

    meta.appendChild(site);
  }

  if (plan.reservationNumber) {
    const number =
      document.createElement("span");

    number.textContent =
      `予約番号：${plan.reservationNumber}`;

    meta.appendChild(number);
  }

  // 予約状況
  const reservation =
    document.createElement("div");

  reservation.className =
    "plan-reservation";

  const reservationBadge =
    document.createElement("span");

  const reservationClass =
    getReservationClass(
      plan.reservationStatus
    );

  reservationBadge.className =
    `reservation-badge ${reservationClass}`;

  reservationBadge.textContent =
    RESERVATION_LABELS[
      plan.reservationStatus
    ] || "未予約";

  reservation.appendChild(
    reservationBadge
  );

  // メモ
  const memo =
    document.createElement("p");

  memo.className =
    "plan-memo";

  memo.textContent =
    plan.memo || "";

  if (!plan.memo) {
    memo.classList.add("hidden");
  }

  // 下段
  const bottom =
    document.createElement("div");

  bottom.className =
    "plan-bottom";

  // 金額
  const amount =
    document.createElement("span");

  amount.className =
    "plan-amount";

  if (
    plan.amount !== null &&
    plan.amount !== undefined &&
    plan.amount !== ""
  ) {
    amount.textContent =
      `¥${Number(plan.amount).toLocaleString("ja-JP")}`;
  } else {
    amount.textContent = "";
  }

  // 操作ボタン
  const actions =
    document.createElement("div");

  actions.className =
    "plan-actions";

  // 編集
  const editButton =
    document.createElement("button");

  editButton.type = "button";

  editButton.className =
    "plan-action-button";

  editButton.textContent =
    "編集";

  editButton.addEventListener(
    "click",
    () => {
      openEditPlanModal(plan.id);
    }
  );

  // 削除
  const deleteButton =
    document.createElement("button");

  deleteButton.type = "button";

  deleteButton.className =
    "plan-action-button delete";

  deleteButton.textContent =
    "削除";

  deleteButton.addEventListener(
    "click",
    () => {
      openDeletePlanModal(plan.id);
    }
  );

  actions.appendChild(editButton);
  actions.appendChild(deleteButton);

  bottom.appendChild(amount);
  bottom.appendChild(actions);

  // 内容を組み立てる
  content.appendChild(titleRow);
  content.appendChild(meta);
  content.appendChild(reservation);
  content.appendChild(memo);
  content.appendChild(bottom);

  item.appendChild(time);
  item.appendChild(content);

  return item;
}

/* =========================
   イベント作成・編集
========================= */

function openCreateEventModal() {
  eventFormElement.reset();

  modalTitleElement.textContent =
    "新しいイベント";

  eventIdInput.value = "";

  eventColorInput.value = "#245eff";
  eventStatusInput.value = "preparing";

  updateColorValue();

  eventModalElement.classList.remove(
    "hidden"
  );

  setTimeout(() => {
    eventTitleInput.focus();
  }, 50);
}

function openEditEventModal(eventId) {
  const event =
    findEventById(eventId);

  if (!event) {
    return;
  }

  modalTitleElement.textContent =
    "イベントを編集";

  eventIdInput.value = event.id;
  eventTitleInput.value = event.title || "";
  eventStartDateInput.value =
    event.startDate || "";

  eventEndDateInput.value =
    event.endDate || "";

  eventLocationInput.value =
    event.location || "";

  eventStatusInput.value =
    event.status || "preparing";

  eventColorInput.value =
    event.color || "#245eff";

  eventMemoInput.value =
    event.memo || "";

  updateColorValue();

  eventModalElement.classList.remove(
    "hidden"
  );

  setTimeout(() => {
    eventTitleInput.focus();
  }, 50);
}

function updatePlanFieldsByType() {
  const isHotel =
    planTypeInput.value === "hotel";

  normalPlanFields.classList.toggle(
    "hidden",
    isHotel
  );

  hotelPlanFields.classList.toggle(
    "hidden",
    !isHotel
  );
}

planTypeInput.addEventListener(
  "change",
  updatePlanFieldsByType
);

function saveEventFromForm() {
  const title =
    eventTitleInput.value.trim();

  const startDate =
    eventStartDateInput.value;

  const endDate =
    eventEndDateInput.value;

  const location =
    eventLocationInput.value.trim();

  const status =
    eventStatusInput.value;

  const color =
    eventColorInput.value;

  const memo =
    eventMemoInput.value.trim();

  if (!title) {
    alert("イベント名を入力してください。");
    return;
  }

  if (!startDate) {
    alert("開始日を入力してください。");
    return;
  }

  if (endDate && endDate < startDate) {
    alert(
      "終了日は開始日以降の日付にしてください。"
    );
    return;
  }

  const editingEventId =
    eventIdInput.value;

  if (editingEventId) {
    const targetEvent =
      findEventById(editingEventId);

    if (!targetEvent) {
      alert("編集対象が見つかりません。");
      return;
    }

    targetEvent.title = title;
    targetEvent.startDate = startDate;
    targetEvent.endDate = endDate;
    targetEvent.location = location;
    targetEvent.status = status;
    targetEvent.color = color;
    targetEvent.memo = memo;
  } else {
    const newEvent = {
      id: createId("event"),

      number: getNextEventNumber(),

      title,
      startDate,
      endDate,
      location,

      image: "",
      color,
      status,
      memo,

      plans: [],
      payments: [],
      shopping: []
    };

    appData.events.push(newEvent);
  }

  saveData();
  renderEvents();

  if (
    currentEventId &&
    editingEventId === currentEventId
  ) {
    const updatedEvent =
      findEventById(currentEventId);

    if (updatedEvent) {
      renderEventDetail(updatedEvent);
    }
  }

  closeEventModal();
}

function deleteEvent(eventId) {
  const event =
    findEventById(eventId);

  if (!event) {
    return;
  }

  const confirmed =
    window.confirm(
      `「${event.title}」を削除しますか？`
    );

  if (!confirmed) {
    return;
  }

  appData.events =
    appData.events.filter(
      (item) => item.id !== eventId
    );

  saveData();
  renderEvents();

  if (currentEventId === eventId) {
    currentEventId = null;
    switchPage("events-page");
  }
}

/* =========================
   メモ
========================= */

function openMemoModal() {
  const event =
    findEventById(currentEventId);

  if (!event) {
    return;
  }

  memoInput.value =
    event.memo || "";

  memoModalElement.classList.remove(
    "hidden"
  );

  setTimeout(() => {
    memoInput.focus();
  }, 50);
}

function saveMemo() {
  const event =
    findEventById(currentEventId);

  if (!event) {
    return;
  }

  event.memo =
    memoInput.value.trim();

  saveData();
  renderEventDetail(event);
  closeMemoModal();
}

function closeMemoModal() {
  memoModalElement.classList.add(
    "hidden"
  );
}

/* =========================
   予定作成・編集
========================= */

function openCreatePlanModal() {
  const event =
    findEventById(currentEventId);

  if (!event) {
    return;
  }

  planFormElement.reset();

  planModalTitleElement.textContent =
    "予定を追加";

  planIdInput.value = "";

  planTypeInput.value = "transport";

  hotelCheckinDateInput.value = "";
  hotelCheckinTimeInput.value = "";
  hotelCheckoutDateInput.value = "";
  hotelCheckoutTimeInput.value = "";
  updatePlanFieldsByType();
  
  planReservationStatusInput.value =
    "unreserved";

  /*
   * イベント開始日を初期値にする
   */
  planDateInput.value =
    event.startDate || "";

  planModalElement.classList.remove(
    "hidden"
  );

  setTimeout(() => {
    planTitleInput.focus();
  }, 50);
}

function openEditPlanModal(planId) {
  const event =
    findEventById(currentEventId);

  if (!event) {
    return;
  }

  const plan =
    event.plans.find(
      (item) => item.id === planId
    );

  if (!plan) {
    return;
  }

  planModalTitleElement.textContent =
    "予定を編集";

  planIdInput.value = plan.id;
  planTitleInput.value = plan.title || "";
  planTypeInput.value = plan.type || "other";

  if (plan.type === "hotel") {
    hotelCheckinDateInput.value =
      plan.checkInDate || plan.date || "";

    hotelCheckinTimeInput.value =
      plan.checkInTime || plan.startTime || "";

    hotelCheckoutDateInput.value =
      plan.checkOutDate || plan.date || "";

    hotelCheckoutTimeInput.value =
      plan.checkOutTime || plan.endTime || "";
  } else {
    planDateInput.value =
      plan.date || "";

    planStartTimeInput.value =
      plan.startTime || "";

    planEndTimeInput.value =
      plan.endTime || "";
  }

  updatePlanFieldsByType();

  planLocationInput.value =
    plan.location || "";

  planReservationStatusInput.value =
    plan.reservationStatus || "unreserved";

  planReservationSiteInput.value =
    plan.reservationSite || "";

  planReservationNumberInput.value =
    plan.reservationNumber || "";

  planAmountInput.value =
    plan.amount ?? "";

  planMemoInput.value =
    plan.memo || "";

  planModalElement.classList.remove(
    "hidden"
  );

  setTimeout(() => {
    planTitleInput.focus();
  }, 50);
}

function savePlanFromForm() {
  const event =
    findEventById(currentEventId);

  if (!event) {
    return;
  }

  const title =
    planTitleInput.value.trim();

  const type =
    planTypeInput.value;

  let date = "";
  let startTime = "";
  let endTime = "";

  let checkInDate = "";
  let checkInTime = "";
  let checkOutDate = "";
  let checkOutTime = "";

  if (type === "hotel") {
    checkInDate =
      hotelCheckinDateInput.value;

    checkInTime =
      hotelCheckinTimeInput.value;

    checkOutDate =
      hotelCheckoutDateInput.value;

    checkOutTime =
      hotelCheckoutTimeInput.value;

    if (!checkInDate) {
      alert("チェックイン日を入力してください。");
      return;
    }

    if (!checkOutDate) {
      alert("チェックアウト日を入力してください。");
      return;
    }

    if (
      checkInDate > checkOutDate ||
      (
        checkInDate === checkOutDate &&
        checkInTime &&
        checkOutTime &&
        checkOutTime < checkInTime
      )
    ) {
      alert(
        "チェックアウトはチェックイン以降にしてください。"
      );
      return;
    }

    // 既存データとの互換用
    date = checkInDate;
    startTime = checkInTime;
    endTime = checkOutTime;

  } else {
    date =
      planDateInput.value;

    startTime =
      planStartTimeInput.value;

    endTime =
      planEndTimeInput.value;
  }

  const location =
    planLocationInput.value.trim();

  const reservationStatus =
    planReservationStatusInput.value;

  const reservationSite =
    planReservationSiteInput.value.trim();

  const reservationNumber =
    planReservationNumberInput.value.trim();

  const amountValue =
    planAmountInput.value;

  const memo =
    planMemoInput.value.trim();

  if (!title) {
    alert("予定名を入力してください。");
    return;
  }

  if (!date) {
    alert("日付を入力してください。");
    return;
  }

  const amount =
    amountValue === ""
      ? null
      : Number(amountValue);

  const editingPlanId =
    planIdInput.value;

  if (editingPlanId) {
    const targetPlan =
      event.plans.find(
        (plan) => plan.id === editingPlanId
      );

    if (!targetPlan) {
      alert("編集対象の予定が見つかりません。");
      return;
    }

    targetPlan.title = title;
    targetPlan.type = type;
    targetPlan.date = date;
    targetPlan.startTime = startTime;
    targetPlan.endTime = endTime;

    targetPlan.checkInDate = checkInDate;
    targetPlan.checkInTime = checkInTime;
    targetPlan.checkOutDate = checkOutDate;
    targetPlan.checkOutTime = checkOutTime;

    targetPlan.location = location;
    targetPlan.reservationStatus =
      reservationStatus;
    targetPlan.reservationSite =
      reservationSite;
    targetPlan.reservationNumber =
      reservationNumber;
    targetPlan.amount = amount;
    targetPlan.memo = memo;
  } else {
    event.plans.push({
      id: createId("plan"),

      title,
      type,
      date,
      startTime,
      endTime,
      checkInDate,
      checkInTime,
      checkOutDate,
      checkOutTime,
      location,

      reservationStatus,
      reservationSite,
      reservationNumber,

      amount,
      memo
    });
  }

  saveData();
  renderEventDetail(event);
  closePlanModal();
}

/* =========================
   予定削除
========================= */

function openDeletePlanModal(planId) {
  deleteTargetPlanId = planId;

  deletePlanModalElement.classList.remove(
    "hidden"
  );
}

function closeDeletePlanModal() {
  deleteTargetPlanId = null;

  deletePlanModalElement.classList.add(
    "hidden"
  );
}

function deletePlan() {
  const event =
    findEventById(currentEventId);

  if (!event || !deleteTargetPlanId) {
    closeDeletePlanModal();
    return;
  }

  const targetPlan =
    event.plans.find(
      (plan) => plan.id === deleteTargetPlanId
    );

  if (!targetPlan) {
    closeDeletePlanModal();
    return;
  }

  const confirmed =
    window.confirm(
      `「${targetPlan.title}」を削除しますか？`
    );

  if (!confirmed) {
    return;
  }

  event.plans =
    event.plans.filter(
      (plan) => plan.id !== deleteTargetPlanId
    );

  saveData();
  renderAll();
  closeDeletePlanModal();
}

/* =========================
   モーダル操作
========================= */

function closeEventModal() {
  eventModalElement.classList.add(
    "hidden"
  );
}

function closePlanModal() {
  planModalElement.classList.add(
    "hidden"
  );
}

/* =========================
   ページ切り替え
========================= */

function switchPage(pageId) {
  const pages =
    document.querySelectorAll(".page");

  const navigationButtons =
    document.querySelectorAll(".nav-button");

  pages.forEach((page) => {
    page.classList.toggle(
      "active-page",
      page.id === pageId
    );
  });

  navigationButtons.forEach((button) => {
    /*
     * 詳細ページ表示中はイベントタブを選択状態にする
     */
    const isEventPage =
      pageId === "events-page" ||
      pageId === "detail-page";

    if (
      isEventPage &&
      button.dataset.page === "events-page"
    ) {
      button.classList.add("active");
      return;
    }

    button.classList.toggle(
      "active",
      button.dataset.page === pageId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* =========================
   補助関数
========================= */

function findEventById(eventId) {
  return appData.events.find(
    (event) => event.id === eventId
  );
}

function createId(prefix) {
  const randomPart =
    Math.random()
      .toString(36)
      .substring(2, 9);

  return `${prefix}-${Date.now()}-${randomPart}`;
}

function getNextEventNumber() {
  if (appData.events.length === 0) {
    return 1;
  }

  const numbers =
    appData.events
      .map((event) => Number(event.number) || 0)
      .filter((number) => number > 0);

  if (numbers.length === 0) {
    return 1;
  }

  return Math.max(...numbers) + 1;
}

function formatDateRange(startDate, endDate) {
  if (!startDate) {
    return "日付未設定";
  }

  const start =
    formatDate(startDate);

  if (!endDate || endDate === startDate) {
    return start;
  }

  const end =
    formatDate(endDate);

  return `${start} - ${end}`;
}

function formatDate(dateString) {
  if (!dateString) {
    return "";
  }

  const date =
    new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    }
  ).format(date);
}

function formatScheduleDate(dateString) {
  if (!dateString) {
    return "日付未設定";
  }

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month: "long",
      day: "numeric",
      weekday: "short"
    }
  ).format(date);
}

function formatShortDate(dateString) {
  if (!dateString) {
    return "--/--";
  }

  const date =
    new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month: "2-digit",
      day: "2-digit"
    }
  ).format(date);
}

function formatTimeRange(startTime, endTime) {
  if (!startTime && !endTime) {
    return "--:--";
  }

  if (startTime && endTime) {
    return `${startTime} - ${endTime}`;
  }

  return startTime || endTime;
}

function getReservationClass(status) {
  if (status === "reserved") {
    return "reserved";
  }

  if (status === "unreserved") {
    return "unreserved";
  }

  if (status === "not_required") {
    return "not-required";
  }

  return "";
}

function updateColorValue() {
  colorValueElement.textContent =
    eventColorInput.value.toUpperCase();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

/* =====================================================
   Phase 3: 同行者・人ごとの精算・予算管理
===================================================== */
(function setupPhase3() {

  const yen = v =>
    `¥${Number(v || 0).toLocaleString("ja-JP")}`;

  const id = p =>
    `${p}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

  const people = () =>
    appData.people || [];

  const nameOf = id =>
    people().find(p => p.id === id)?.name ||
    (id === "self" ? "自分" : "不明");

  const ensureSelf = () => {
    if (!people().some(p => p.id === "self")) {
      appData.people.unshift({
        id: "self",
        name: "自分",
        fixed: true
      });

      saveData();
    }
  };

  const plans = e =>
    Array.isArray(e.plans)
      ? e.plans
      : (e.plans = []);

  const planAmount = p =>
    Number(p.amount || 0);

  const targetIds = p =>
    Array.isArray(p.settlement?.targetIds) &&
    p.settlement.targetIds.length
      ? p.settlement.targetIds
      : ["self"];

  const payerId = p =>
    p.settlement?.payerId || "self";

  const records = () =>
    appData.events.flatMap(e =>
      plans(e)
        .filter(
          p =>
            p.settlement?.enabled &&
            planAmount(p) > 0
        )
        .map(p => ({
          event: e,
          plan: p
        }))
    );

  const totals = () => {
    const out = {};

    people().forEach(p => {
      out[p.id] = {
        name: p.name,
        paid: 0,
        bears: 0,
        balance: 0
      };
    });

    records()
      .filter(({ plan: p }) => !p.settlement?.settled)
      .forEach(({ plan: p }) => {

        const targets = targetIds(p);
        const each = planAmount(p) / targets.length;

        if (!out[payerId(p)]) {
          out[payerId(p)] = {
            name: nameOf(payerId(p)),
            paid: 0,
            bears: 0,
            balance: 0
          };
        }

        out[payerId(p)].paid += planAmount(p);

        targets.forEach(t => {
          if (!out[t]) {
            out[t] = {
              name: nameOf(t),
              paid: 0,
              bears: 0,
              balance: 0
            };
          }

          out[t].bears += each;
        });
      });

    Object.values(out).forEach(x => {
      x.balance = x.paid - x.bears;
    });

    return out;
  };


  function fillPlanPeople() {

    const payer = document.getElementById("plan-payer");

    if (!payer) return;

    payer.innerHTML = people()
      .map(
        p =>
          `<option value="${p.id}">
            ${escapeHtml(p.name)}
          </option>`
      )
      .join("");

    const box =
      document.getElementById("plan-target-people");

    if (!box) return;

    box.innerHTML = people()
      .map(
        p =>
          `<label>
            <input
              type="checkbox"
              name="plan-target"
              value="${p.id}"
              checked
            />
            ${escapeHtml(p.name)}
          </label>`
      )
      .join("");

    document
      .getElementById("plan-target-mode")
      ?.addEventListener("change", e => {
        box.classList.toggle(
          "hidden",
          e.target.value !== "custom"
        );
      });
  }


  function readSettlementFromPlan() {

    const enabled =
      document.getElementById(
        "plan-settlement-enabled"
      )?.checked;

    if (!enabled) {
      return {
        enabled: false
      };
    }

    const mode =
      document.getElementById(
        "plan-target-mode"
      )?.value || "all";

    const targetIds =
      mode === "all"
        ? people().map(p => p.id)
        : [
            ...document.querySelectorAll(
              'input[name="plan-target"]:checked'
            )
          ].map(x => x.value);

    if (!targetIds.length) {
      alert("支払対象者を1人以上選んでください。");
      return null;
    }

    return {
      enabled: true,
      payerId:
        document.getElementById("plan-payer")?.value ||
        "self",
      targetIds,
      settled: false
    };
  }


  function showPlanSettlement(p) {

    const s = p.settlement;

    if (!s?.enabled || !planAmount(p)) {
      return "";
    }

    const targets = targetIds(p);

    return `
      <div class="plan-money-line">
        精算：${yen(planAmount(p))}
        ／ ${escapeHtml(nameOf(payerId(p)))}立替
        ／ ${targets.length}人で割り勘
        （1人 ${yen(planAmount(p) / targets.length)}）
      </div>
    `;
  }


  const originalOpenCreate =
    window.openCreatePlanModal;

  window.openCreatePlanModal = function () {

    originalOpenCreate();

    fillPlanPeople();

    document.getElementById(
      "plan-settlement-enabled"
    ).checked = false;

    document.getElementById(
      "plan-target-mode"
    ).value = "all";

    document.getElementById(
      "plan-target-people"
    ).classList.add("hidden");
  };


  const originalOpenEdit =
    window.openEditPlanModal;

  window.openEditPlanModal = function (pid) {

    originalOpenEdit(pid);

    fillPlanPeople();

    const e = findEventById(currentEventId);

    const p = e?.plans.find(
      x => x.id === pid
    );

    const s = p?.settlement;

    document.getElementById(
      "plan-settlement-enabled"
    ).checked = !!s?.enabled;

    document.getElementById(
      "plan-payer"
    ).value = s?.payerId || "self";

    document.getElementById(
      "plan-target-mode"
    ).value = "custom";

    document.getElementById(
      "plan-target-people"
    ).classList.toggle(
      "hidden",
      !s?.enabled
    );

    document
      .querySelectorAll(
        'input[name="plan-target"]'
      )
      .forEach(x => {
        x.checked =
          (s?.targetIds || []).includes(x.value);
      });
  };


  const originalSave =
    window.savePlanFromForm;

  window.savePlanFromForm = function () {

    const e = findEventById(currentEventId);

    const before = e?.plans.find(
      p =>
        p.id ===
        document.getElementById("plan-id")?.value
    );

    const s = readSettlementFromPlan();

    if (s === null) return;

    originalSave();

    const after =
      e?.plans.find(
        p =>
          p.id ===
          document.getElementById("plan-id")?.value
      ) ||
      (e?.plans || []).at(-1);

    if (after) {
      after.settlement = s;
      saveData();
    }

    renderAll();
  };


  function renderAll() {
    renderPeople();
    renderSettlements();

    if (currentEventId) {
      renderEventDetail(
        findEventById(currentEventId)
      );
    }
  }


  function renderPeople() {

    const el =
      document.getElementById("people-list");

    if (!el) return;

    el.innerHTML = people()
      .map(
        p =>
          `<div class="person-row">
            <span>${escapeHtml(p.name)}</span>

            ${
              p.id === "self"
                ? "<small>固定</small>"
                : `
                  <button
                    class="card-action-button delete"
                    data-person="${p.id}"
                  >
                    ×
                  </button>
                `
            }
          </div>`
      )
      .join("");

    el
      .querySelectorAll("[data-person]")
      .forEach(b => {

        b.onclick = () => {

          appData.people =
            people().filter(
              p => p.id !== b.dataset.person
            );

          saveData();
          renderAll();
        };
      });
  }


  function renderSettlements() {

    const sum =
      document.getElementById(
        "settlement-summary"
      );

    const list =
      document.getElementById(
        "settlement-list"
      );

    if (!sum || !list) return;

    const t = totals();

    sum.innerHTML =
      Object.values(t)
        .map(
          x =>
            `<button
              type="button"
              class="money-summary-card person-summary-card"
              data-person-summary="${
                escapeHtml(
                  people().find(
                    p => p.name === x.name
                  )?.id || ""
                )
              }"
              aria-expanded="false"
            >
              <span>
                ${escapeHtml(x.name)}
              </span>

              <strong>
                ${x.balance >= 0 ? "+" : ""}
                ${yen(x.balance)}
              </strong>

              <small>
                立替 ${yen(x.paid)}
                ／
                負担 ${yen(x.bears)}
              </small>

              <em>
                タップで明細を見る
              </em>
            </button>`
        )
        .join("");

    list.innerHTML = `
      <p class="settlement-help">
        人をタップすると、その人のイベント・
        スケジュールごとの明細が表示されます。
      </p>
    `;
  }


  function personDetails(pid) {

    const rows =
      records().filter(
        ({ plan: p }) =>
          !p.settlement?.settled &&
          (
            payerId(p) === pid ||
            targetIds(p).includes(pid)
          )
      );

    return (
      rows
        .map(({ event: e, plan: p }) => {

          const targets = targetIds(p);
          const each =
            planAmount(p) / targets.length;

          const paid =
            payerId(p) === pid
              ? planAmount(p)
              : 0;

          const bear =
            targets.includes(pid)
              ? each
              : 0;

          return `
            <section class="settlement-event-card">

              <h3>
                ${escapeHtml(e.title || "イベント")}
              </h3>

              <div class="settlement-event-meta">
                ${escapeHtml(p.title)}
                ・
                ${yen(planAmount(p))}
              </div>

              <p>
                立替：${yen(paid)}
                ／
                本人負担：${yen(bear)}
              </p>

              <button
                class="settle-toggle-button"
                data-settle-plan="${p.id}"
              >
                ${
                  p.settlement?.settled
                    ? "精算済みを取り消す"
                    : "精算済みにする"
                }
              </button>

            </section>
          `;
        })
        .join("")
    ) || "<p>未精算の明細はありません。</p>";
  }


  document.addEventListener("click", e => {

    const b =
      e.target.closest("[data-settle-plan]");

    if (!b) return;

    const pid = b.dataset.settlePlan;

    for (const ev of appData.events) {

      const pl =
        plans(ev).find(
          x => x.id === pid
        );

      if (pl?.settlement) {

        pl.settlement.settled =
          !pl.settlement.settled;

        saveData();
        renderAll();

        break;
      }
    }
  });


  const originalRender =
    window.renderEventDetail;

  window.renderEventDetail = function (e) {

    originalRender(e);

    const paper =
      document.querySelector(
        "#detail-page .note-paper"
      );

    if (!paper) return;

    let sec =
      document.getElementById(
        "detail-money-section"
      );

    if (!sec) {

      sec = document.createElement("div");

      sec.id =
        "detail-money-section";

      sec.className =
        "note-section";

      paper.append(
        document.createElement("div")
      );

      paper.lastChild.className =
        "note-divider";

      paper.append(sec);
    }

    const rs =
      records().filter(
        r =>
          r.event.id === e.id &&
          targetIds(r.plan).includes("self")
      );

    sec.innerHTML = `
      <div class="section-heading">

        <span class="section-number">
          03
        </span>

        <div>
          <p class="eyebrow">
            MONEY
          </p>

          <h2>
            清算・予算管理

            <span class="detail-budget-total">
              自分負担合計：
              ${yen(
                rs.reduce(
                  (a, { plan: p }) =>
                    a +
                    planAmount(p) /
                      targetIds(p).length,
                  0
                )
              )}
            </span>
          </h2>
        </div>

      </div>

      <p class="settlement-event-meta">
        自分の負担分のみ表示／
        精算済みは人ごとの合算から除外
      </p>

      ${
        rs
          .map(({ plan: p }) => `
            <div
              class="payment-row
              ${p.settlement?.settled ? "is-settled" : ""}"
            >

              <div>

                <strong>
                  ${escapeHtml(p.title)}
                </strong>

                <br>

                ${escapeHtml(nameOf(payerId(p)))}
                が立替／
                ${targetIds(p).length}
                人で割り勘

                <br>

                <small>
                  自分の負担：
                  ${yen(
                    planAmount(p) /
                      targetIds(p).length
                  )}

                  ${
                    p.settlement?.settled
                      ? "（精算済み）"
                      : ""
                  }
                </small>

              </div>

              <strong>
                ${yen(
                  planAmount(p) /
                    targetIds(p).length
                )}
              </strong>

            </div>
          `)
          .join("")
        ||
        "<p>自分が支払う精算対象の予定はありません。</p>"
      }
    `;
  };


  document.addEventListener("click", e => {

    const b =
      e.target.closest(
        "[data-person-summary]"
      );

    if (!b) return;

    const pid =
      b.dataset.personSummary;

    const list =
      document.getElementById(
        "settlement-list"
      );

    if (!list) return;

    document
      .querySelectorAll(
        "[data-person-summary]"
      )
      .forEach(x => {
        x.setAttribute(
          "aria-expanded",
          String(x === b)
        );
      });

    list.innerHTML = `
      <div class="person-detail-heading">

        <h3>
          ${escapeHtml(nameOf(pid))}の明細
        </h3>

        <button
          type="button"
          class="card-action-button"
          data-close-person-details
        >
          閉じる
        </button>

      </div>

      ${personDetails(pid)}
    `;
  });


  document.addEventListener("click", e => {

    if (
      e.target.closest(
        "[data-close-person-details]"
      )
    ) {
      renderSettlements();
    }
  });


  document.addEventListener(
    "DOMContentLoaded",
    () => {

      ensureSelf();

      document
        .getElementById("person-form")
        ?.addEventListener(
          "submit",
          e => {

            e.preventDefault();

            const i =
              document.getElementById(
                "person-name"
              );

            const n =
              i.value.trim();

            if (
              n &&
              !people().some(
                p => p.name === n
              )
            ) {

              appData.people.push({
                id: id("person"),
                name: n
              });

              i.value = "";

              saveData();
              renderAll();
            }
          }
        );

      renderAll();
    }
  );

})();
