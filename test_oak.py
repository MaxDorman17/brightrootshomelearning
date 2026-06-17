import httpx, re, json

url = "https://www.thenational.academy/pupils/programmes/geography-secondary-year-7/units/weather-and-climate-why-does-our-weather-and-climate-change/lessons"
r = httpx.get(url, follow_redirects=True)
print("status:", r.status_code)

slugs = re.findall(r'/lessons/([a-z0-9-]+)"', r.text)
print("lesson slugs found:", slugs[:6])
print("has NEXT_DATA:", "__NEXT_DATA__" in r.text)

if "__NEXT_DATA__" in r.text:
    m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
    if m:
        data = json.loads(m.group(1))
        print("NEXT_DATA keys:", list(data.get("props", {}).get("pageProps", {}).keys())[:10])
