// Elemen-elemen DOM
const dropArea = document.getElementById("dropArea");
const uploadContent = document.getElementById("uploadContent");
const imageUpload = document.getElementById("imageUpload");
const previewContainer = document.getElementById("previewContainer");
const imagePreview = document.getElementById("imagePreview");
const clearButton = document.getElementById("clearButton");
const classifyButton = document.getElementById("classifyButton");
const loadingSection = document.getElementById("loadingSection");
const loadingText = document.getElementById("loadingText");
const resultSection = document.getElementById("resultSection");
const resultImage = document.getElementById("resultImage");
const resultName = document.getElementById("resultName");
const confidenceValue = document.getElementById("confidenceValue");
const confidenceBar = document.getElementById("confidenceBar");
const predictionsList = document.getElementById("predictionsList");
const cameraButton = document.getElementById("cameraButton");
const cameraPreview = document.getElementById("cameraPreview");
const captureButton = document.getElementById("captureButton");
const switchCameraButton = document.getElementById("switchCameraButton");
const cameraModal = document.getElementById("cameraModal");
const closeModal = document.getElementById("closeModal");
const modalCamera = document.getElementById("modalCamera");
const modalCaptureButton = document.getElementById("modalCaptureButton");
const modalSwitchButton = document.getElementById("modalSwitchButton");
const cameraCanvas = document.getElementById("cameraCanvas");

// Variabel global
let model;
let classNames = [];
let currentImage = null;
let stream = null;
let facingMode = "user"; // 'user' untuk kamera depan, 'environment' untuk kamera belakang

// Inisialisasi aplikasi
document.addEventListener("DOMContentLoaded", async () => {
  setupEventListeners();
  checkWebcamAvailability();
});

// Setup event listeners
function setupEventListeners() {
  // Drop area events
  dropArea.addEventListener("click", () => imageUpload.click());
  dropArea.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropArea.classList.add("highlight");
  });
  dropArea.addEventListener("dragleave", () => {
    dropArea.classList.remove("highlight");
  });
  dropArea.addEventListener("drop", (e) => {
    e.preventDefault();
    dropArea.classList.remove("highlight");

    if (e.dataTransfer.files.length) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  });

  // File input change
  imageUpload.addEventListener("change", (e) => {
    if (e.target.files.length) {
      handleImageUpload(e.target.files[0]);
    }
  });

  // Clear button
  clearButton.addEventListener("click", (e) => {
    e.stopPropagation();
    clearImage();
  });

  // Classify button
  classifyButton.addEventListener("click", startClassification);

  // Camera buttons
  cameraButton.addEventListener("click", openCameraModal);
  closeModal.addEventListener("click", closeCameraModal);
  modalCaptureButton.addEventListener("click", captureImage);
  modalSwitchButton.addEventListener("click", switchCamera);

  // Tombol kamera di area utama (jika ada)
  captureButton.addEventListener("click", captureImage);
  switchCameraButton.addEventListener("click", switchCamera);

  // Tutup modal ketika klik di luar modal
  window.addEventListener("click", (e) => {
    if (e.target === cameraModal) {
      closeCameraModal();
    }
  });
}

// Cek ketersediaan kamera
function checkWebcamAvailability() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    cameraButton.style.display = "none";
    console.log("Kamera tidak didukung di browser ini");
    return;
  }

  navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      const videoDevices = devices.filter(
        (device) => device.kind === "videoinput"
      );
      if (videoDevices.length === 0) {
        cameraButton.style.display = "none";
        console.log("Tidak ada kamera yang terdeteksi");
      }
    })
    .catch((err) => {
      console.error("Error checking video devices:", err);
      cameraButton.style.display = "none";
    });
}

// Buka kamera modal
function openCameraModal() {
  cameraModal.style.display = "flex";
  startWebcam(modalCamera);
}

// Tutup kamera modal
function closeCameraModal() {
  cameraModal.style.display = "none";
  stopWebcam();
}

// Mulai webcam
function startWebcam(videoElement) {
  if (stream) {
    stopWebcam();
  }

  const constraints = {
    video: { facingMode: facingMode },
  };

  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((str) => {
      stream = str;
      videoElement.srcObject = stream;

      if (videoElement === modalCamera) {
        modalCaptureButton.style.display = "block";
        modalSwitchButton.style.display = "block";
      } else {
        captureButton.style.display = "block";
        switchCameraButton.style.display = "block";
      }
    })
    .catch((err) => {
      console.error("Error accessing webcam:", err);
      alert(
        "Tidak dapat mengakses kamera. Pastikan Anda telah memberikan izin kamera."
      );
    });
}

// Hentikan webcam
function stopWebcam() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }

  modalCamera.srcObject = null;
  cameraPreview.srcObject = null;
  captureButton.style.display = "none";
  switchCameraButton.style.display = "none";
}

// Ganti kamera
function switchCamera() {
  facingMode = facingMode === "user" ? "environment" : "user";

  if (cameraModal.style.display === "flex") {
    startWebcam(modalCamera);
  } else {
    startWebcam(cameraPreview);
  }
}

// Ambil gambar dari kamera
function captureImage() {
  const video =
    cameraModal.style.display === "flex" ? modalCamera : cameraPreview;
  const canvas = cameraCanvas;

  // Set canvas dimensions to match video
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw video frame to canvas
  const ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  // Convert to blob
  canvas.toBlob(
    (blob) => {
      const file = new File([blob], "camera-capture.jpg", {
        type: "image/jpeg",
      });
      handleImageUpload(file);

      if (cameraModal.style.display === "flex") {
        closeCameraModal();
      }
    },
    "image/jpeg",
    0.9
  );
}

// Handle upload gambar
function handleImageUpload(file) {
  // Validasi tipe file
  if (!file.type.match("image.*")) {
    alert("Hanya file gambar yang diizinkan (JPG, JPEG, PNG)");
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    uploadContent.style.display = "none";
    previewContainer.style.display = "flex";
    imagePreview.src = e.target.result;
    resultSection.style.display = "none";

    // Simpan gambar untuk diproses
    currentImage = new Image();
    currentImage.src = e.target.result;

    // Aktifkan tombol klasifikasi
    classifyButton.disabled = false;
  };

  reader.readAsDataURL(file);
}

// Bersihkan gambar
function clearImage() {
  uploadContent.style.display = "flex";
  previewContainer.style.display = "none";
  imagePreview.src = "";
  currentImage = null;
  classifyButton.disabled = true;
  resultSection.style.display = "none";
}

// Mulai proses klasifikasi
async function startClassification() {
  if (!currentImage) {
    alert("Silakan unggah gambar terlebih dahulu");
    return;
  }

  loadingSection.style.display = "block";
  resultSection.style.display = "none";

  try {
    // Memuat model jika belum dimuat
    if (!model) {
      loadingText.innerText = "Memuat model...";
      await loadModel();
    }

    loadingText.innerText = "Mengklasifikasi gambar...";

    // Lakukan klasifikasi
    setTimeout(async () => {
      try {
        const predictions = await classifyImage(currentImage);
        displayResults(predictions);
      } catch (error) {
        console.error("Error during classification:", error);
        alert("Terjadi kesalahan saat mengklasifikasi gambar");
        loadingSection.style.display = "none";
      }
    }, 500); // Sedikit delay untuk UX yang lebih baik
  } catch (error) {
    console.error("Error loading model:", error);
    alert("Terjadi kesalahan saat memuat model");
    loadingSection.style.display = "none";
  }
}

// Muat model TensorFlow.js
async function loadModel() {
  try {
    // Lokasi model TensorFlow.js (sesuaikan dengan lokasi hosting Anda)
    const modelUrl = "./tfjs_model/model.json";
    model = await tf.loadLayersModel(modelUrl);

    // Muat nama kelas
    await loadClassNames();

    console.log("Model berhasil dimuat");
    return model;
  } catch (error) {
    console.error("Gagal memuat model:", error);
    throw error;
  }
}

// Muat nama kelas
async function loadClassNames() {
  try {
    // Ambil nama kelas dari file class_names.txt
    const response = await fetch("./class_names.txt");
    const text = await response.text();
    classNames = text.trim().split("\n");
    console.log("Class names loaded:", classNames);
  } catch (error) {
    console.error("Error loading class names:", error);
    // Gunakan beberapa nama kelas umum makanan Padang sebagai fallback
    classNames = [
      "rendang",
      "dendeng_batokok",
      "ayam_pop",
      "gulai_ikan",
      "gulai_ayam",
      "telur_balado",
      "ikan_bakar",
      "perkedel_kentang",
    ];
  }
}

// Klasifikasi gambar
async function classifyImage(image) {
  return tf.tidy(() => {
    // Preprocess gambar
    const tensor = preprocessImage(image);

    // Lakukan prediksi
    const predictions = model.predict(tensor);

    // Konversi ke array JavaScript
    const data = predictions.dataSync();

    // Buat array hasil prediksi
    const resultArray = Array.from(data).map((score, i) => ({
      className: classNames[i] || `Class ${i}`,
      probability: score,
    }));

    // Sort berdasarkan probabilitas tertinggi
    return resultArray.sort((a, b) => b.probability - a.probability);
  });
}

// Preprocessing gambar untuk input model
function preprocessImage(image) {
  // Resize gambar ke ukuran yang diharapkan model
  const tensor = tf.browser
    .fromPixels(image)
    .resizeNearestNeighbor([224, 224]) // Sesuaikan dengan ukuran input model
    .toFloat()
    .div(tf.scalar(255.0))
    .expandDims();

  return tensor;
}

// Tampilkan hasil klasifikasi
function displayResults(predictions) {
  loadingSection.style.display = "none";
  resultSection.style.display = "block";

  // Setel gambar hasil
  resultImage.src = currentImage.src;

  // Tampilkan kelas dengan probabilitas tertinggi
  const topPrediction = predictions[0];
  const readableName = formatClassName(topPrediction.className);
  resultName.textContent = readableName;

  // Tampilkan tingkat keyakinan
  const confidence = topPrediction.probability * 100;
  confidenceValue.textContent = `${confidence.toFixed(2)}%`;
  confidenceBar.style.width = `${confidence}%`;

  // Sesuaikan warna bar berdasarkan keyakinan
  if (confidence > 90) {
    confidenceBar.style.backgroundColor = "#28a745"; // Green
  } else if (confidence > 70) {
    confidenceBar.style.backgroundColor = "#ffc107"; // Yellow
  } else {
    confidenceBar.style.backgroundColor = "#dc3545"; // Red
  }

  // Tampilkan prediksi lainnya
  predictionsList.innerHTML = "";
  for (let i = 1; i < Math.min(predictions.length, 4); i++) {
    const prediction = predictions[i];
    const readableName = formatClassName(prediction.className);
    const prob = prediction.probability * 100;

    const li = document.createElement("li");
    li.innerHTML = `
            <span>${readableName}</span>
            <span>${prob.toFixed(2)}%</span>
        `;
    predictionsList.appendChild(li);
  }

  // Scroll ke hasil
  resultSection.scrollIntoView({ behavior: "smooth" });
}

// Format nama kelas menjadi lebih mudah dibaca
function formatClassName(name) {
  // Ganti underscore dengan spasi dan kapitalisasi setiap kata
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Pembersihan resources saat halaman ditutup
window.addEventListener("beforeunload", () => {
  if (model) {
    model.dispose();
  }
  stopWebcam();
});
