import sys
import json
from datetime import datetime
from zoneinfo import ZoneInfo
import swisseph as swe

def get_zodiac_sign(longitude):
    signs = [
        "Aries", "Taurus", "Gemini", "Cancer",
        "Leo", "Virgo", "Libra", "Scorpio",
        "Sagittarius", "Capricorn", "Aquarius", "Pisces"
    ]
    sign_idx = int(longitude / 30.0) % 12
    degree = longitude % 30.0
    return {
        "sign": signs[sign_idx],
        "degree": round(degree, 4),
        "total_longitude": round(longitude, 4)
    }

def main():
    if len(sys.argv) < 7:
        print(json.dumps({"error": "Insufficient arguments. Usage: python ephemeris.py <mode> <date> <time> <latitude> <longitude> <timezone>"}))
        return

    mode = sys.argv[1] # 'chart' or 'transit'
    date_str = sys.argv[2] # YYYY-MM-DD
    time_str = sys.argv[3] # HH:MM
    try:
        latitude = float(sys.argv[4])
        longitude = float(sys.argv[5])
    except ValueError:
        print(json.dumps({"error": f"Invalid latitude/longitude: {sys.argv[4]}, {sys.argv[5]}"}))
        return
        
    timezone_str = sys.argv[6]

    # Set timezone and parse local datetime
    try:
        local_tz = ZoneInfo(timezone_str)
    except Exception:
        local_tz = ZoneInfo("UTC")

    try:
        dt = datetime.strptime(f"{date_str} {time_str}", "%Y-%m-%d %H:%M")
        dt_local = dt.replace(tzinfo=local_tz)
        dt_utc = dt_local.astimezone(ZoneInfo("UTC"))
    except Exception as e:
        print(json.dumps({"error": f"Failed to parse datetime: {str(e)}"}))
        return

    # Calculate Julian Day UT
    decimal_hour = dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0
    jd_ut = swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, decimal_hour)

    # Planets to calculate
    planet_ids = {
        "Sun": swe.SUN,
        "Moon": swe.MOON,
        "Mercury": swe.MERCURY,
        "Venus": swe.VENUS,
        "Mars": swe.MARS,
        "Jupiter": swe.JUPITER,
        "Saturn": swe.SATURN,
        "Uranus": swe.URANUS,
        "Neptune": swe.NEPTUNE,
        "Pluto": swe.PLUTO,
        "Rahu": swe.MEAN_NODE # Mean lunar node (Rahu)
    }

    placements = {}
    
    # Calculate positions
    for p_name, p_id in planet_ids.items():
        try:
            # swe.calc_ut returns (longitude, latitude, distance, speed_in_longitude, ...)
            res, ret = swe.calc_ut(jd_ut, p_id)
            lon = res[0]
            pos_info = get_zodiac_sign(lon)
            # Check if retrograde
            is_retro = res[3] < 0
            pos_info["isRetrograde"] = is_retro
            placements[p_name] = pos_info
        except Exception as e:
            placements[p_name] = {"error": str(e)}

    # Calculate Ketu (exactly 180 degrees opposite to Rahu)
    if "Rahu" in placements and "total_longitude" in placements["Rahu"]:
        rahu_lon = placements["Rahu"]["total_longitude"]
        ketu_lon = (rahu_lon + 180.0) % 360.0
        ketu_info = get_zodiac_sign(ketu_lon)
        ketu_info["isRetrograde"] = placements["Rahu"]["isRetrograde"]
        placements["Ketu"] = ketu_info

    result_data = {
        "inputs": {
            "date": date_str,
            "time": time_str,
            "latitude": latitude,
            "longitude": longitude,
            "timezone": timezone_str,
            "julianDayUT": jd_ut
        },
        "placements": placements
    }

    if mode == "chart":
        # Calculate house cusps and Ascendant/Midheaven
        # swe.houses returns (cusps, ascmc)
        try:
            # Note: swisseph longitude is: positive East, negative West.
            cusps, ascmc = swe.houses(jd_ut, latitude, longitude, b'P')
            
            # Map Ascendant and Midheaven
            asc_info = get_zodiac_sign(ascmc[0])
            mc_info = get_zodiac_sign(ascmc[1])
            
            result_data["ascendant"] = asc_info
            result_data["midheaven"] = mc_info
            
            # Map house cusps (12 houses)
            houses = {}
            for i, cusp in enumerate(cusps):
                houses[f"House_{i+1}"] = get_zodiac_sign(cusp)
            result_data["houses"] = houses

            # Inject Ascendant into placements for consistency with other parts of the system
            result_data["placements"]["Ascendant"] = asc_info
            
        except Exception as e:
            result_data["houses_error"] = str(e)

    print(json.dumps(result_data))

if __name__ == "__main__":
    main()
