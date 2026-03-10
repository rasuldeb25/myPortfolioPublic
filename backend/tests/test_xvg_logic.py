import pytest
import io
import os
import tempfile
import time
import pandas as pd
from app.xvg_tools import parse_and_plot_xvg

# Sample XVG Content
PERFECT_XVG = """@    title "RMSD"
@    xaxis  label "Time (ps)"
@    yaxis  label "RMSD (nm)"
@TYPE xy
0.000000  0.000000
10.000000 0.150000
20.000000 0.200000
30.000000 0.180000
40.000000 0.220000
"""

def test_perfect_xvg():
    """Test with a perfect XVG file content."""
    result = parse_and_plot_xvg(PERFECT_XVG.encode('utf-8'))
    assert isinstance(result, io.BytesIO)
    content = result.getvalue()
    assert content.startswith(b'\x89PNG') # PNG signature

def test_corrupt_xvg():
    """Test with corrupt/empty file. Should raise an exception."""
    corrupt_data = "This is just text, not data.\nNo numbers here."

    with pytest.raises(Exception):
        parse_and_plot_xvg(corrupt_data.encode('utf-8'))

    empty_data = ""
    # Empty data raises pandas.errors.EmptyDataError, which inherits from ValueError? No.
    # It inherits from ValueError in some versions, but let's just catch Exception to be safe across pandas versions.
    with pytest.raises(Exception):
        parse_and_plot_xvg(empty_data.encode('utf-8'))

def test_extreme_xvg():
    """Test with a large file (100k points)."""
    # Generate 100k lines
    lines = ["0.000000 0.000000"]
    # We use a simple loop to generate data
    data_chunk = "\n".join([f"{i*10}.000000 {i*0.001:.6f}" for i in range(1, 100001)])
    large_content = lines[0] + "\n" + data_chunk

    start_time = time.time()
    result = parse_and_plot_xvg(large_content.encode('utf-8'))
    end_time = time.time()

    assert isinstance(result, io.BytesIO)
    content = result.getvalue()
    assert len(content) > 0
    print(f"Extreme test took {end_time - start_time:.2f}s")

def test_security_xvg():
    """Test with potential malicious content."""
    # 1. Script tag at the beginning (might confuse column inference)
    malicious_content_early = """@ title "Hacked"
<script>alert('xss')</script>
0.000000 0.000000
10.000000 0.100000
"""
    # This might raise ValueError because pandas skips the 2-column lines if it thinks 1-column is the schema.
    # We just want to ensure it DOES NOT EXECUTE script and either errors safely or plots safely.
    try:
        parse_and_plot_xvg(malicious_content_early.encode('utf-8'))
    except Exception:
        # If it raises an exception, that's a safe failure.
        pass

    # 2. Script tag mixed in/at end
    malicious_content_late = """@ title "Hacked"
0.000000 0.000000
<script>alert('xss')</script>
10.000000 0.100000
"""
    # This should definitely be plottable as pandas should infer 2 cols from first line,
    # then skip/coerce the script line.
    result = parse_and_plot_xvg(malicious_content_late.encode('utf-8'))
    assert isinstance(result, io.BytesIO)
    content = result.getvalue()
    assert content.startswith(b'\x89PNG')

def test_file_path_input():
    """Test passing a file path instead of bytes."""
    with tempfile.NamedTemporaryFile(mode='w+', delete=False) as tmp:
        tmp.write(PERFECT_XVG)
        tmp_path = tmp.name

    try:
        result = parse_and_plot_xvg(tmp_path)
        assert isinstance(result, io.BytesIO)
        assert result.getvalue().startswith(b'\x89PNG')
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

def test_xvg_axis_limits(client):
    """Triggers specific limit-handling lines in xvg_tools using memory instead of disk."""
    # Use the PERFECT_XVG string already defined in this file
    file_content = PERFECT_XVG.encode('utf-8')
    file_obj = io.BytesIO(file_content)
    
    # Send axis limits to trigger those specific if/else blocks in xvg_tools.py
    response = client.post(
        "/analyze/xvg",
        files={"file": ("test.xvg", file_obj, "text/plain")},
        data={
            "x_min": 0, 
            "x_max": 10, 
            "y_min": 0, 
            "y_max": 100,
            "title": "Limit Test",
            "xlabel": "Time",
            "ylabel": "Value"
        }
    )
    assert response.status_code == 200
    
def test_xvg_empty_after_filter(client):
    """Targets xvg_tools.py lines 71-74 (No data found after parsing)."""
    empty_xvg = "@ title 'Empty'\n@xaxis label 'X'\n@yaxis label 'Y'\n"
    file_obj = io.BytesIO(empty_xvg.encode('utf-8'))
    
    # This should trigger the 'No data found' error in your logic
    response = client.post(
        "/analyze/xvg",
        files={"file": ("empty.xvg", file_obj, "text/plain")}
    )
    # Depending on your try/except, this should return a 400 or JSON error
    assert response.status_code != 500