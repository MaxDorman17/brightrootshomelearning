import httpx, re, json

url = "https://www.thenational.academy/pupils/programmes/geography-secondary-year-7/units/weather-and-climate-why-does-our-weather-and-climate-change/lessons"
r = httpx.get(url, follow_redirects=True)

m = re.search(r'<script id="__NEXT_DATA__" type="application/json">(.*?)</script>', r.text)
data = json.loads(m.group(1))
browse = data["props"]["pageProps"]["browseData"]

# Print structure
if isinstance(browse, list):
    print("browseData is a list of", len(browse), "items")
    print("first item keys:", list(browse[0].keys()) if browse else "empty")
    for item in browse[:3]:
        print(" ", item)
elif isinstance(browse, dict):
    print("browseData keys:", list(browse.keys()))
    print(json.dumps(browse, indent=2)[:1000])
