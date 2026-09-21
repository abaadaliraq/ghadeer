const artistContact = {
  website: "https://ghadeer-altaee.vercel.app/",
  whatsapp: "#",
  instagram: "#",
  phone: "#",
};
const artworks = [
  {
    id: 1,
    title: "العمل الأول",
    subtitle: "تكوين معماري بغدادي",
    description:
      "عمل مجسّم يستعيد واجهات البيت البغدادي التقليدي بتفاصيله الدقيقة، من الشناشيل والنوافذ والأبواب إلى الطابوق والزخارف المعمارية، ضمن معالجة يدوية تمنح العمل إحساساً قريباً من أثر المكان الحقيقي.",
    mainImage: "assets/images/artworks/work-01/main.jpg",
    details: [
      "assets/images/artworks/work-01/detail-01.jpg",
      "assets/images/artworks/work-01/detail-02.jpg",
      "assets/images/artworks/work-01/detail-03.jpg",
      "assets/images/artworks/work-01/detail-04.jpg",
    ],
  },
  {
    id: 2,
    title: "العمل الثاني",
    subtitle: "ذاكرة الواجهة",
    description:
      "تكوين يستحضر الواجهة البغدادية بوصفها ذاكرة بصرية، حيث تظهر النوافذ والخشب والطابوق والتكوينات الإنشائية ضمن بناء مجسّم يركز على أثر الزمن وملمس المواد.",
    mainImage: "assets/images/artworks/work-02/main.jpg",
    details: [
      "assets/images/artworks/work-02/detail-01.jpg",
      "assets/images/artworks/work-02/detail-02.jpg",
      "assets/images/artworks/work-02/detail-03.jpg",
      "assets/images/artworks/work-02/detail-04.jpg",
    ],
  },
  {
    id: 3,
    title: "العمل الثالث",
    subtitle: "تفاصيل من بغداد",
    description:
      "عمل يعيد بناء مجموعة من العناصر المعمارية المألوفة في بغداد القديمة ضمن مشهد مصغّر، لتصبح التفاصيل الصغيرة جزءاً من ذاكرة المكان لا مجرد زخرفة.",
    mainImage: "assets/images/artworks/work-03/main.jpg",
    details: [
      "assets/images/artworks/work-03/detail-01.jpg",
      "assets/images/artworks/work-03/detail-02.jpg",
      "assets/images/artworks/work-03/detail-03.jpg",
      "assets/images/artworks/work-03/detail-04.jpg",
    ],
  },
];

const metadataItems = ["عمل يدوي", "تفاصيل معمارية", "خامات واقعية"];

function toArabicNumber(value) {
  return String(value).padStart(2, "0");
}

function createArtworkBlock(artwork) {
  const article = document.createElement("article");
  article.className = "artwork-block";

  const detailsMarkup = artwork.details
    .map(
      (src, index) => `
        <figure class="detail-slide" data-detail-slide>
          <img src="${src}" alt="تفصيل ${index + 1} من ${artwork.title}" loading="lazy" />
        </figure>`
    )
    .join("");

  article.innerHTML = `
    <figure class="artwork-main-image reveal-item artwork-reveal-1">
      <img src="${artwork.mainImage}" alt="${artwork.title}" loading="lazy" />
    </figure>

    <div class="artwork-content">
      <div class="artwork-number reveal-item artwork-reveal-2">
        <span>${toArabicNumber(artwork.id)}</span>
        <span>${artwork.title}</span>
      </div>

      <div class="artwork-title-group reveal-item artwork-reveal-2">
        <h3>${artwork.title}</h3>
        <p class="artwork-subtitle">${artwork.subtitle}</p>
      </div>

      <p class="artwork-description reveal-item artwork-reveal-3">${artwork.description}</p>

      <ul class="artwork-meta reveal-item artwork-reveal-3">
        ${metadataItems.map((item) => `<li>${item}</li>`).join("")}
      </ul>
    </div>

    <section class="detail-gallery reveal-item artwork-reveal-4" aria-label="تفاصيل ${artwork.title}">
      <div class="detail-gallery-header">
        <p class="detail-gallery-title">تفاصيل العمل</p>
        <p class="detail-counter" data-detail-counter>01 / ${toArabicNumber(artwork.details.length)}</p>
      </div>
      <div class="detail-track" data-detail-track>${detailsMarkup}</div>
    </section>
  `;

  return article;
}

function renderArtworks() {
  const container = document.querySelector("#artworks-list");

  if (!container) {
    return;
  }

  container.innerHTML = "";
  artworks.forEach((artwork) => container.appendChild(createArtworkBlock(artwork)));
}

function updateDetailCounter(gallery) {
  const track = gallery.querySelector("[data-detail-track]");
  const counter = gallery.querySelector("[data-detail-counter]");
  const slides = Array.from(gallery.querySelectorAll("[data-detail-slide]:not(.is-hidden)"));

  if (!track || !counter) {
    return;
  }

  if (slides.length === 0) {
    gallery.classList.add("is-empty");
    return;
  }

  gallery.classList.remove("is-empty");

  const trackBox = track.getBoundingClientRect();
  const trackCenter = trackBox.left + trackBox.width / 2;
  let activeIndex = 0;
  let closestDistance = Number.POSITIVE_INFINITY;

  slides.forEach((slide, index) => {
    const slideBox = slide.getBoundingClientRect();
    const slideCenter = slideBox.left + slideBox.width / 2;
    const distance = Math.abs(trackCenter - slideCenter);

    if (distance < closestDistance) {
      closestDistance = distance;
      activeIndex = index;
    }
  });

  counter.textContent = `${toArabicNumber(activeIndex + 1)} / ${toArabicNumber(slides.length)}`;
}

function setupDetailGalleries() {
  document.querySelectorAll(".detail-gallery").forEach((gallery) => {
    const track = gallery.querySelector("[data-detail-track]");
    const slides = Array.from(gallery.querySelectorAll("[data-detail-slide]"));

    if (!track) {
      return;
    }

    slides.forEach((slide) => {
      const img = slide.querySelector("img");

      img.addEventListener("load", () => updateDetailCounter(gallery));
      img.addEventListener("error", () => {
        slide.classList.add("is-hidden");
        updateDetailCounter(gallery);
      });
    });

    let isDragging = false;
    let startX = 0;
    let startScrollLeft = 0;

    track.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") {
        return;
      }

      isDragging = true;
      startX = event.clientX;
      startScrollLeft = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointermove", (event) => {
      if (!isDragging) {
        return;
      }

      event.preventDefault();
      track.scrollLeft = startScrollLeft - (event.clientX - startX);
    });

    ["pointerup", "pointercancel", "pointerleave"].forEach((eventName) => {
      track.addEventListener(eventName, () => {
        isDragging = false;
        track.classList.remove("is-dragging");
      });
    });

    track.addEventListener("scroll", () => updateDetailCounter(gallery), { passive: true });
    updateDetailCounter(gallery);
  });
}

function revealOnScroll(selector) {
  const elements = document.querySelectorAll(selector);

  if (!("IntersectionObserver" in window)) {
    elements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -15% 0px", threshold: 0.01 }
  );

  elements.forEach((element) => observer.observe(element));
}



function setupContactLinks() {
  document.querySelectorAll("[data-contact-link]").forEach((link) => {
    const key = link.dataset.contactLink;
    const value = artistContact[key] || "#";

    link.href = value;

    if (key === "website") {
      const websiteText = link.querySelector("[data-contact-website-text]");

      if (websiteText) {
        websiteText.textContent = value.replace(/^https?:\/\//, "").replace(/\/$/, "");
      }
    }

    link.addEventListener("click", (event) => {
      if (value === "#") {
        event.preventDefault();
      }
    });
  });
}function setupOptionalImages() {
  document.querySelectorAll("[data-optional-image]").forEach((figure) => {
    const image = figure.querySelector("img");

    if (!image) {
      return;
    }

    const showImage = () => {
      figure.classList.add("is-loaded");
    };

    const removeImage = () => {
      figure.remove();
    };

    image.addEventListener("load", showImage);
    image.addEventListener("error", removeImage);

    if (image.complete) {
      if (image.naturalWidth > 0) {
        showImage();
      } else {
        removeImage();
      }
    }
  });
}window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => {
    document.documentElement.classList.add("is-ready");
  });

  renderArtworks();
  setupDetailGalleries();
  setupOptionalImages();
  setupContactLinks();
  revealOnScroll(".artist-section, .artworks-section, .artwork-block, .house-section, .contact-section");
});




