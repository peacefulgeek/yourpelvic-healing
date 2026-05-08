"""
Generate one article hero image using OpenAI DALL-E 3.
Usage: python3 gen-one-image.py "slug|||prompt"
"""
import sys, os, json, time, requests
from openai import OpenAI

client = OpenAI()

def generate_image(slug, prompt, output_dir="/home/ubuntu/the-pelvic-floor/article-images"):
    output_path = os.path.join(output_dir, f"{slug}.jpg")
    
    # Skip if already exists
    if os.path.exists(output_path) and os.path.getsize(output_path) > 10000:
        return output_path, "skipped"
    
    for attempt in range(3):
        try:
            response = client.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1792x1024",
                quality="standard",
                n=1
            )
            image_url = response.data[0].url
            
            # Download the image
            img_response = requests.get(image_url, timeout=30)
            img_response.raise_for_status()
            
            os.makedirs(output_dir, exist_ok=True)
            with open(output_path, 'wb') as f:
                f.write(img_response.content)
            
            return output_path, "generated"
            
        except Exception as e:
            if attempt < 2:
                time.sleep(5 * (attempt + 1))
            else:
                return None, f"error: {str(e)[:100]}"

if __name__ == "__main__":
    input_str = sys.argv[1] if len(sys.argv) > 1 else ""
    if "|||" not in input_str:
        print(json.dumps({"slug": "", "path": "", "status": "error: bad input"}))
        sys.exit(1)
    
    slug, prompt = input_str.split("|||", 1)
    path, status = generate_image(slug, prompt)
    print(json.dumps({"slug": slug, "path": path or "", "status": status}))
