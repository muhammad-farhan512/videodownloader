document.addEventListener("DOMContentLoaded", function () {
  // Theme switching functionality
  const themeSwitcher = document.getElementById("theme-switcher");
  const body = document.body;

  // Check for saved theme preference or use preferred color scheme
  const savedTheme =
    localStorage.getItem("theme") ||
    (window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light");
  body.classList.add(`${savedTheme}-theme`);

  themeSwitcher.addEventListener("click", () => {
    if (body.classList.contains("dark-theme")) {
      body.classList.remove("dark-theme");
      body.classList.add("light-theme");
      localStorage.setItem("theme", "light");
    } else {
      body.classList.remove("light-theme");
      body.classList.add("dark-theme");
      localStorage.setItem("theme", "dark");
    }
  });

  // Tab switching functionality
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.getAttribute("data-tab");

      // Update active tab button
      tabBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Show corresponding tab content
      tabContents.forEach((content) => {
        content.classList.remove("active");
        if (content.id === tabId) {
          content.classList.add("active");
        }
      });
    });
  });

  // Fetch functionality
  document
    .getElementById("fetch-video")
    .addEventListener("click", fetchVideoInfo);
  document
    .getElementById("fetch-audio")
    .addEventListener("click", fetchAudioInfo);

  // Loading modal
  const loadingModal = document.getElementById("loading-modal");
  const loadingText = document.getElementById("loading-text");

  // Toast notification
  const toast = document.getElementById("toast");

  function showToast(message, type = "info") {
    toast.textContent = message;
    toast.className = "toast show";

    // Set different colors based on type
    if (type === "error") {
      toast.style.backgroundColor = "var(--danger-color)";
    } else if (type === "success") {
      toast.style.backgroundColor = "var(--success-color)";
    } else {
      toast.style.backgroundColor = "var(--dark-color)";
    }

    setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  function showLoading(message) {
    loadingText.textContent = message;
    loadingModal.style.display = "flex";
  }

  function hideLoading() {
    loadingModal.style.display = "none";
  }

  // Extract video ID from YouTube URL
  function getYouTubeVideoId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  }

  // Mock function to fetch YouTube video title (in real app, use YouTube API)
  async function fetchYouTubeVideoTitle(videoId) {
    // This is a mock implementation
    // In a real app, you would use the YouTube API or a backend service
    const mockTitles = {
      dQw4w9WgXcQ:
        "Rick Astley - Never Gonna Give You Up (Official Music Video)",
      "9bZkp7q19f0": "PSY - GANGNAM STYLE(강남스타일) M/V",
      kJQP7kiw5Fk: "Luis Fonsi - Despacito ft. Daddy Yankee",
    };

    return mockTitles[videoId] || "YouTube Video";
  }

  // Get domain from URL
  function getDomain(url) {
    try {
      const domain = new URL(url).hostname.replace("www.", "");
      return domain;
    } catch {
      return null;
    }
  }

  // Mock API call for video
  async function fetchVideoInfo() {
    const urlInput = document.getElementById("video-url");
    const url = urlInput.value.trim();

    if (!url) {
      showToast("Please enter a video URL", "error");
      return;
    }

    showLoading("Fetching video information...");

    try {
      if (!isValidUrl(url)) {
        throw new Error("Invalid URL format");
      }

      let videoTitle = "Video Download";
      const domain = getDomain(url);

      // Special handling for YouTube
      if (domain === "youtube.com" || domain === "youtu.be") {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          videoTitle = await fetchYouTubeVideoTitle(videoId);
        }
      }

      // Mock response with the extracted title
      const mockVideoData = {
        title: videoTitle,
        thumbnail:
          domain === "youtube.com"
            ? `https://i.ytimg.com/vi/${
                getYouTubeVideoId(url) || "dQw4w9WgXcQ"
              }/maxresdefault.jpg`
            : "https://via.placeholder.com/1280x720",
        duration: "3:45",
        formats: [
          { quality: "1080p", type: "MP4", size: "45.2 MB" },
          { quality: "720p", type: "MP4", size: "28.7 MB" },
          { quality: "480p", type: "MP4", size: "15.3 MB" },
          { quality: "360p", type: "MP4", size: "9.8 MB" },
          { quality: "Audio Only", type: "MP3", size: "4.2 MB" },
        ],
      };

      displayVideoInfo(mockVideoData);
      showToast("Video information fetched successfully!", "success");

      // Show title input
      document.querySelector("#mp4 .title-input").style.display = "block";
    } catch (error) {
      showToast(error.message || "Failed to fetch video information", "error");
    } finally {
      hideLoading();
    }
  }

  // Mock API call for audio
  async function fetchAudioInfo() {
    const urlInput = document.getElementById("audio-url");
    const url = urlInput.value.trim();

    if (!url) {
      showToast("Please enter an audio/video URL", "error");
      return;
    }

    showLoading("Fetching audio information...");

    try {
      if (!isValidUrl(url)) {
        throw new Error("Invalid URL format");
      }

      let audioTitle = "Audio Download";
      const domain = getDomain(url);

      // Special handling for YouTube
      if (domain === "youtube.com" || domain === "youtu.be") {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          audioTitle = await fetchYouTubeVideoTitle(videoId);
        }
      }

      // Mock response with the extracted title
      const mockAudioData = {
        title: audioTitle,
        thumbnail:
          domain === "youtube.com"
            ? `https://i.ytimg.com/vi/${
                getYouTubeVideoId(url) || "dQw4w9WgXcQ"
              }/maxresdefault.jpg`
            : "https://via.placeholder.com/1280x720",
        duration: "3:45",
        formats: [
          {
            quality: "High Quality",
            type: "MP3",
            size: "4.2 MB",
            bitrate: "320 kbps",
          },
          {
            quality: "Medium Quality",
            type: "MP3",
            size: "3.1 MB",
            bitrate: "256 kbps",
          },
          {
            quality: "Standard Quality",
            type: "MP3",
            size: "2.4 MB",
            bitrate: "192 kbps",
          },
        ],
      };

      displayAudioInfo(mockAudioData);
      showToast("Audio information fetched successfully!", "success");

      // Show title input
      document.querySelector("#mp3 .title-input").style.display = "block";
    } catch (error) {
      showToast(error.message || "Failed to fetch audio information", "error");
    } finally {
      hideLoading();
    }
  }

  function isValidUrl(url) {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  function displayVideoInfo(data) {
    const preview = document.getElementById("video-preview");
    const options = document.getElementById("video-formats");

    // Update preview
    preview.innerHTML = `
            <div class="video-info">
                <img src="${data.thumbnail}" alt="Video thumbnail" class="thumbnail">
                <div class="info">
                    <h3>${data.title}</h3>
                    <p><i class="fas fa-clock"></i> Duration: ${data.duration}</p>
                </div>
            </div>
        `;

    // Set default title
    document.getElementById("video-title").value = data.title;

    // Update download options
    options.innerHTML = "";
    data.formats.forEach((format) => {
      const option = document.createElement("div");
      option.className = "format-option";
      option.innerHTML = `
                <h4>${format.quality}</h4>
                <p><strong>Format:</strong> ${format.type}</p>
                <p><strong>Size:</strong> ${format.size}</p>
                <button class="download-btn" data-quality="${format.quality}" data-type="${format.type}">
                    <i class="fas fa-download"></i> Download
                </button>
            `;
      options.appendChild(option);

      // Add download handler
      option.querySelector(".download-btn").addEventListener("click", () => {
        const customTitle =
          document.getElementById("video-title").value.trim() || data.title;
        downloadMedia(format.quality, format.type, customTitle);
      });
    });
  }

  function displayAudioInfo(data) {
    const preview = document.getElementById("audio-preview");
    const options = document.getElementById("audio-formats");

    // Update preview
    preview.innerHTML = `
            <div class="audio-info">
                <img src="${data.thumbnail}" alt="Audio thumbnail" class="thumbnail">
                <div class="info">
                    <h3>${data.title}</h3>
                    <p><i class="fas fa-clock"></i> Duration: ${data.duration}</p>
                </div>
            </div>
        `;

    // Set default title
    document.getElementById("audio-title").value = data.title;

    // Update download options
    options.innerHTML = "";
    data.formats.forEach((format) => {
      const option = document.createElement("div");
      option.className = "format-option";
      option.innerHTML = `
                <h4>${format.quality}</h4>
                <p><strong>Format:</strong> ${format.type}</p>
                <p><strong>Bitrate:</strong> ${format.bitrate}</p>
                <p><strong>Size:</strong> ${format.size}</p>
                <button class="download-btn" data-quality="${format.quality}" data-type="${format.type}">
                    <i class="fas fa-download"></i> Download
                </button>
            `;
      options.appendChild(option);

      // Add download handler
      option.querySelector(".download-btn").addEventListener("click", () => {
        const customTitle =
          document.getElementById("audio-title").value.trim() || data.title;
        downloadMedia(format.quality, format.type, customTitle);
      });
    });
  }

  function downloadMedia(quality, type, title) {
    showLoading(`Preparing ${quality} ${type} download...`);

    // Simulate download preparation
    setTimeout(() => {
      hideLoading();

      // Create a mock download (in a real app, this would be an actual download)
      const blob = new Blob([`Mock ${type} file for ${title} (${quality})`], {
        type: "text/plain",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;

      // Use the custom title for the filename
      const safeTitle = title.replace(/[^a-z0-9]/gi, "_").toLowerCase();
      a.download = `${safeTitle}_${quality}.${type.toLowerCase()}`;

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(`Downloading: ${title} (${quality} ${type})`, "success");
    }, 1000);
  }
});
