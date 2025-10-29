import { GoogleGenAI, Type } from "@google/genai";
import type { CustomConfiguration, DeviceType, AdvisorCriteria, AdvisorResultData } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- START: Configuration Generation Service ---

const configResponseSchema = {
  type: Type.OBJECT,
  properties: {
    deviceName: { type: Type.STRING },
    description: { type: Type.STRING },
    designDescription: { type: Type.STRING },
    basePrice: { type: Type.NUMBER },
    customizations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          component: { type: Type.STRING },
          selection: { type: Type.STRING },
          reason: { type: Type.STRING },
          price: { type: Type.NUMBER },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                selection: { type: Type.STRING },
                reason: { type: Type.STRING },
                price: { type: Type.NUMBER },
              },
              required: ['selection', 'reason', 'price'],
            },
          },
        },
        required: ['component', 'selection', 'reason', 'price', 'options'],
      },
    },
    totalPrice: { type: Type.NUMBER },
  },
  required: ['deviceName', 'description', 'designDescription', 'basePrice', 'customizations', 'totalPrice'],
};

const mainPromptTemplate = (userPrompt: string, deviceType: DeviceType) => `
    You are "TechSpec AI", a value-focused tech expert and futuristic product designer. Your primary mission is to create devices for the year 2025-2026 that offer the best possible performance-per-dollar.
    Analyze the user's prompt: "${userPrompt}".
    Generate a complete, futuristic ${deviceType} configuration. Prioritize high-value components; avoid overpriced parts if a cheaper alternative offers 90% of the performance.
    
    You MUST research and include the latest and most famous camera sensors and chipsets from reputed, real-world companies.
    - For 'Chipset/CPU': Use the latest and upcoming models from famous companies like **Qualcomm (e.g., Snapdragon 8 Gen 4), Apple (e.g., A18 Pro), MediaTek (e.g., Dimensity 9400), Intel (e.g., Core Ultra 200 series), and AMD (e.g., Ryzen 9000 series)**. Always mention the company and model name.
    - For 'Camera System': Use real, famous sensor models from reputed companies like **Sony (e.g., LYTIA LYT-900, IMX989) and Samsung (e.g., ISOCELL HP2, GNK)**. Always mention the company and sensor model.

    For a 'phone', the base price should be around $450 USD. Include these components:
    1. Chipset/CPU
    2. RAM
    3. Storage
    4. Display Size & Type: MUST include specific metrics like **refresh rate (e.g., 60Hz, 120Hz LTPO)** and **peak brightness (e.g., 1000 nits, 2000 nits)** in the selection text. The reason should explain the trade-offs.
    5. Camera System (for specs)
    6. Battery
    7. Form Factor: This is a mandatory component. The options MUST include 'Classic Bar', 'Book-Style Foldable', and 'Clamshell Foldable'.
    8. Material & Color
    9. Camera Design (for visual layout)
    10. Haptic Engine: The options MUST ALWAYS include 'Advanced Linear Motor', 'Basic Vibration Motor', and 'No Haptics (Silent Mode Only)'.
    11. Audio System: This is a mandatory component. You MUST generate granular options for audio quality. The options MUST specifically include the following choices, each with a detailed reason and price: 'High-Fidelity Stereo Speakers with Spatial Audio', 'Balanced Stereo Speakers', and 'Standard Mono Speaker'.
    12. Biometric Security: MUST include options like 'Under-Display Fingerprint & 3D Face Unlock', 'Side-Mounted Fingerprint Sensor', and 'PIN/Pattern Only'.

    For a 'laptop', the base price should be around $800 USD. Include these components:
    1. CPU
    2. GPU
    3. RAM
    4. Storage
    5. Display: MUST include specific metrics like panel type (OLED, Mini-LED), **refresh rate (e.g., 60Hz, 120Hz, 165Hz)** and **peak brightness (e.g., 500 nits, 1000 nits)** in the selection text. The reason should explain the trade-offs for creative professionals or gamers.
    6. Battery
    7. Chassis Material & Color
    8. Keyboard Layout
    9. Keyboard Backlight: This is a mandatory component. The options MUST include 'RGB per-key', 'Single-color white', and 'None'.
    10. Design Aesthetic
    11. Port Selection
    12. Webcam & Mics
    13. Cooling System: This is a mandatory component. You MUST generate granular options for thermal management. The options MUST specifically include the following choices, each with a detailed reason and price: 'Advanced Vapor Chamber with Dual Fans & Liquid Metal', 'High-Performance Heat Pipes with RGB Fans', 'Standard Heat Pipes with Single Fan', and 'Passive Cooling (Fanless)'.

    For EACH component:
    - Provide a 'selection' that is the best value choice for the user's needs.
    - Provide a detailed 'reason' explaining why this selection is the best value.
    - Provide a 'price' modification from the base price (use 0 for the base selection).
    - Provide at least 5-7 diverse alternative 'options' (from budget to ultra-premium), each with its own 'selection', 'reason', and 'price'.
    - Ensure the initially selected item is also present in the options list.

    Finally, provide a creative 'deviceName', a compelling 'description' for the device, a detailed 'designDescription' combining the visual elements, a 'basePrice' in USD, and a 'totalPrice' in USD (basePrice + sum of selected option prices).
    Respond ONLY with the JSON object matching the provided schema. Do not include any other text or markdown formatting.
`;

export const generateDeviceImage = async (
    configuration: CustomConfiguration | AdvisorResultData, 
    deviceType: DeviceType, 
    isAdvisor: boolean = false
): Promise<string> => {
    let imagePrompt = '';
    let aspectRatio: '9:16' | '16:9';

    if (isAdvisor) {
        const advisorConfig = configuration as AdvisorResultData;
        imagePrompt = `A professional, clean studio product photograph of the '${advisorConfig.deviceName}' from ${advisorConfig.company}. The device is angled towards the viewer on a neutral, minimalist background. 8k, ultra-realistic, photorealistic.`;
        aspectRatio = deviceType === 'laptop' ? '16:9' : '9:16';
    } else {
        const customConfig = configuration as CustomConfiguration;
        const getSelection = (componentName: string): string => {
            const component = customConfig.customizations.find(c => c.component.toLowerCase().includes(componentName.toLowerCase()));
            return component ? component.selection : '';
        };

        if (deviceType === 'phone') {
            const materialAndColor = getSelection('Material & Color');
            const display = getSelection('Display Size & Type');
            const cameraDesign = getSelection('Camera Design');
            const formFactor = getSelection('Form Factor');
            let formFactorDesc = 'a futuristic 2025 smartphone';
            if (formFactor.toLowerCase().includes('book')) {
                formFactorDesc = 'a book-style foldable smartphone, shown partially open';
            } else if (formFactor.toLowerCase().includes('clamshell')) {
                formFactorDesc = 'a clamshell-style foldable smartphone, shown slightly ajar';
            }
            
            imagePrompt = `A professional, clean studio product photograph of the '${customConfig.deviceName}', ${formFactorDesc}. Body: **${materialAndColor}**. Main Display: **${display}**. Rear camera: **${cameraDesign}**. Neutral, minimalist background. 8k, ultra-realistic. Crucially, the device must be clean and unbranded, with **no logos, text, or symbols** visible on its body.`;
            aspectRatio = '9:16';
        } else { // Laptop
            const materialAndColor = getSelection('Chassis Material & Color');
            const keyboard = getSelection('Keyboard Layout');
            const aesthetic = getSelection('Design Aesthetic');
            const backlight = getSelection('Keyboard Backlight');
            imagePrompt = `A dynamic, professional studio product photograph of the '${customConfig.deviceName}', a futuristic 2025 laptop. The design is a **${aesthetic}**. It is open and angled to showcase its **${keyboard}**. The keyboard is illuminated with **${backlight}** lighting. The body is made of **${materialAndColor}**. The screen displays a vibrant, abstract wallpaper. Shot on a neutral, minimalist background with soft lighting. 8k, ultra-realistic, photorealistic. Crucially, the device must be clean and unbranded, with **no logos, text, or symbols** visible on its body.`;
            aspectRatio = '16:9';
        }
    }

    try {
        const imageResponse = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: imagePrompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (imageResponse.generatedImages && imageResponse.generatedImages.length > 0) {
            const base64ImageBytes: string = imageResponse.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("Image generation failed to return an image.");
    } catch (imageError) {
        console.error("Error during image regeneration:", imageError);
        throw imageError;
    }
};

export const generateConfiguration = async (userPrompt: string, deviceType: DeviceType): Promise<CustomConfiguration> => {
  const prompt = mainPromptTemplate(userPrompt, deviceType); 

  try {
    const configResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: configResponseSchema,
      },
    });

    const aiResponse = JSON.parse(configResponse.text.trim()) as Omit<CustomConfiguration, 'deviceType'>;

    if (!aiResponse.deviceName || !Array.isArray(aiResponse.customizations)) {
      throw new Error("Invalid JSON structure received from AI.");
    }
    
    const parsedJson: CustomConfiguration = {
        ...aiResponse,
        deviceType: deviceType,
    };
    
    parsedJson.customizations.forEach((cust) => {
        if (!cust.options.some((opt) => opt.selection === cust.selection)) {
            cust.options.unshift({ selection: cust.selection, reason: cust.reason, price: cust.price });
        }
    });
    
    try {
        parsedJson.imageUrl = await generateDeviceImage(parsedJson, deviceType);
    } catch (imageError) {
        console.error("Error generating initial device image:", imageError);
    }

    return parsedJson;
  } catch (error) {
    console.error("Error calling Gemini API for config:", error);
    throw new Error(`The AI model returned an unexpected response for config. ${error instanceof Error ? error.message : ''}`);
  }
};


// --- START: Market Advisor Service ---

const advisorPromptTemplate = (criteria: AdvisorCriteria) => `
    You are an expert, impartial tech market analyst. Your goal is to help a user find the best real-world device they can buy right now.
    You MUST use your search tool to find currently available devices from trusted, well-known companies (e.g., Apple, Samsung, Google, Dell, HP, Microsoft, Lenovo).
    The user is looking for a **${criteria.deviceType}**.
    Their price range is **${criteria.priceRange === 'None' ? 'any price' : criteria.priceRange}**.
    Their main priorities are: "**${criteria.priorities}**".

    Based on your search and analysis, recommend the single best ${criteria.deviceType} that fits these criteria.
    Provide a detailed analysis including key specs, pros, cons, and a clear, well-reasoned justification for your choice.
    Present your full analysis as a single JSON object inside a markdown code block. The JSON object must conform to this structure:
    {
      "deviceName": "string",
      "company": "string",
      "description": "string",
      "approximatePriceUSD": number,
      "keySpecs": ["string"],
      "pros": ["string"],
      "cons": ["string"],
      "reasoning": "string"
    }
`;

export const findBestMarketDevice = async (criteria: AdvisorCriteria): Promise<AdvisorResultData> => {
    const prompt = advisorPromptTemplate(criteria);

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                tools: [{ googleSearch: {} }],
            },
        });

        const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
        const webSources = groundingMetadata?.groundingChunks
            ?.map(chunk => chunk.web)
            .filter((web): web is { uri: string; title: string } => !!(web?.uri && web.title)) ?? [];

        let jsonText = response.text.trim();
        const match = jsonText.match(/```json\n([\s\S]*?)\n```/);
        if (match && match[1]) {
            jsonText = match[1];
        }

        const result = JSON.parse(jsonText) as AdvisorResultData;
        result.groundingSources = webSources;

        try {
            result.imageUrl = await generateDeviceImage(result, criteria.deviceType, true);
        } catch (imageError) {
            console.error("Error generating advisor device image:", imageError);
        }

        return result;

    } catch (error) {
        console.error("Error calling Gemini API for advisor:", error);
        throw new Error(`The AI model returned an unexpected response for advisor. ${error instanceof Error ? error.message : ''}`);
    }
};