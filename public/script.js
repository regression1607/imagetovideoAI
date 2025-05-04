// File upload preview
document.addEventListener('DOMContentLoaded', function() {
  const fileInput = document.getElementById('image');
  const fileName = document.getElementById('fileName');
  const previewContainer = document.getElementById('previewContainer');
  const previewImage = document.getElementById('previewImage');
  const dropArea = document.getElementById('dropArea');
  const form = document.getElementById('videoForm');
  const loadingOverlay = document.getElementById('loadingOverlay');
  
  if (fileInput) {
    fileInput.addEventListener('change', function() {
      const file = this.files[0];
      if (file) {
        fileName.textContent = file.name;
        fileName.style.display = 'block';
        
        const reader = new FileReader();
        reader.onload = function(e) {
          previewImage.src = e.target.result;
          previewContainer.style.display = 'block';
        }
        reader.readAsDataURL(file);
      }
    });
  }
  
  // Drag and drop functionality
  if (dropArea) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, preventDefaults, false);
    });
    
    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    ['dragenter', 'dragover'].forEach(eventName => {
      dropArea.addEventListener(eventName, highlight, false);
    });
    
    ['dragleave', 'drop'].forEach(eventName => {
      dropArea.addEventListener(eventName, unhighlight, false);
    });
    
    function highlight() {
      dropArea.classList.add('highlight');
    }
    
    function unhighlight() {
      dropArea.classList.remove('highlight');
    }
    
    dropArea.addEventListener('drop', handleDrop, false);
    
    function handleDrop(e) {
      const dt = e.dataTransfer;
      const files = dt.files;
      fileInput.files = files;
      
      // Trigger change event
      const event = new Event('change');
      fileInput.dispatchEvent(event);
    }
  }
  
  // Show loading overlay on form submit
  if (form) {
    form.addEventListener('submit', function() {
      if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
      }
    });
  }
}); 