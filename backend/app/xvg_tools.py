import matplotlib
matplotlib.use('Agg') # Force non-interactive backend
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.ticker as ticker
import io
import numpy as np
from typing import Union, BinaryIO

def parse_and_plot_xvg(
    file_input: Union[str, BinaryIO, bytes],
    filename: str = "Data", 
    title: str = None, 
    xlabel: str = None, 
    ylabel: str = None,
    dpi: int = 150,
    line_color: str = "#2c3e50",
    legend_label: str = "Trajectory",
    legend_loc: str = "best",
    x_min: float = None,
    x_max: float = None,
    y_min: float = None,
    y_max: float = None,
    bg_color: str = "white",
    show_grid: bool = True,
    x_step: float = None,
    y_step: float = None
) -> io.BytesIO:

    # 1. Handle Input Type
    if isinstance(file_input, bytes):
        data_source = io.BytesIO(file_input)
    else:
 
        data_source = file_input

    # 2. Plot Setup
    plt.style.use('seaborn-v0_8-darkgrid')
    fig, ax = plt.subplots(figsize=(10, 6))
    
    # --- DATA LOADING ---
    df = pd.read_csv(data_source, comment='@', sep=r'\s+', header=None, on_bad_lines='skip', engine='python')

    if not df.empty:
        df = df[~df.iloc[:, 0].astype(str).str.startswith('#')]

    df = df.apply(pd.to_numeric, errors='coerce').dropna(axis=1, how='all').dropna()

    if df.empty:
        plt.close(fig)
        raise ValueError("No valid data found in the file.")

    df.columns = ["Time"] + [f"Val_{i}" for i in range(1, df.shape[1])]

    # Splitter Logic
    df['diff'] = df['Time'].diff()
    split_indices = df.index[df['diff'] < 0].tolist()
    datasets = []
    start_idx = 0
    if not split_indices:
        datasets.append(df)
    else:
        for end_idx in split_indices:
            datasets.append(df.loc[start_idx:end_idx-1])
            start_idx = end_idx
        datasets.append(df.loc[start_idx:]) 

    # --- PLOTTING LOGIC ---
    colors = plt.rcParams['axes.prop_cycle'].by_key()['color']
    custom_names = [name.strip() for name in legend_label.split(',')]
    
    for set_idx, data_chunk in enumerate(datasets):
        color_to_use = colors[set_idx % len(colors)] if len(datasets) > 1 else line_color
        
        if set_idx < len(custom_names) and custom_names[set_idx]:
            label_text = custom_names[set_idx]
        else:
            base = custom_names[0] if custom_names else 'Trajectory'
            label_text = f"{base} {set_idx + 1}" if len(datasets) > 1 else base

        ax.plot(data_chunk["Time"], data_chunk["Val_1"], linewidth=1.5, color=color_to_use, label=label_text, zorder=3)

        if "Val_2" in data_chunk.columns:
            ax.fill_between(data_chunk["Time"], data_chunk["Val_1"]-data_chunk["Val_2"], data_chunk["Val_1"]+data_chunk["Val_2"], color=color_to_use, alpha=0.2, zorder=2)

    # --- CUSTOMIZATION ---
    if title: ax.set_title(title, fontsize=14, fontweight='bold', pad=15)
    ax.set_xlabel(xlabel if xlabel else "Time (ps)", fontsize=12)
    ax.set_ylabel(ylabel if ylabel else "Value (nm / kJ)", fontsize=12)
    
    ax.grid(show_grid, linestyle="--", alpha=0.7)
    
    # Limits
    if x_min is not None: ax.set_xlim(left=x_min)
    if x_max is not None: ax.set_xlim(right=x_max)
    if y_min is not None: ax.set_ylim(bottom=y_min)
    if y_max is not None: ax.set_ylim(top=y_max)

    # --- NEW: TICK STEP CONTROL ---
    if x_step is not None and x_step > 0:
        ax.xaxis.set_major_locator(ticker.MultipleLocator(x_step))
    if y_step is not None and y_step > 0:
        ax.yaxis.set_major_locator(ticker.MultipleLocator(y_step))
    # ------------------------------

    ax.legend(loc=legend_loc, frameon=True, fancybox=True, framealpha=0.8)

    # Saving
    img_buffer = io.BytesIO()
    if bg_color.lower() == "transparent":
        plt.savefig(img_buffer, format="png", dpi=dpi, bbox_inches='tight', transparent=True)
    else:
        fig.patch.set_facecolor(bg_color)
        ax.set_facecolor(bg_color)
        plt.savefig(img_buffer, format="png", dpi=dpi, bbox_inches='tight', facecolor=bg_color)

    plt.close(fig)
    img_buffer.seek(0)
    return img_buffer
