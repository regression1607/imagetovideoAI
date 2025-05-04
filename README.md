# Image to Video AI

A powerful application that converts static images into dynamic videos using AI technology. Built with NestJS, this application allows users to upload an image and provide a prompt to generate a video based on the input.

## Features

- Image upload functionality
- AI-powered video generation
- User-friendly web interface
- Real-time status updates
- Error handling and validation

## Tech Stack

- **Backend**: NestJS (Node.js framework)
- **Frontend**: HTML, CSS, JavaScript
- **AI Integration**: AIMLAPI for video generation
- **Image Hosting**: ImgBB for image storage

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- AIMLAPI API key
- ImgBB API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/regression1607/imagetovideoAI.git
cd imagetovideoAI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your API keys:
```
AIMLAPI_KEY=your_aimlapi_key
IMGBB_API_KEY=your_imgbb_key
```

## Running the Application

1. Start the development server:
```bash
npm run start:dev
```

2. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

1. Upload an image using the web interface
2. Enter a prompt describing the desired video transformation
3. Submit the form and wait for the video generation
4. View and download the generated video

## API Endpoints

- `POST /imagetovideo`: Upload an image and generate a video
  - Parameters:
    - `image`: Image file
    - `prompt`: Text description for video generation

## Error Handling

The application includes comprehensive error handling for:
- Invalid file uploads
- API key authentication issues
- Video generation failures
- Network errors

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## Acknowledgments

- NestJS team for the amazing framework
- AIMLAPI for the video generation capabilities
- ImgBB for image hosting services
