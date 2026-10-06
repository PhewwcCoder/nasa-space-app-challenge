"""Blender 4.5: reproduce the separately authored Opportunity variant.
blender --background --factory-startup --python scripts/build-opportunity.py
The shared builder always starts from the untouched NASA/VTAD MER asset.
"""
import runpy, sys
from pathlib import Path
sys.argv.append('--opportunity')
runpy.run_path(str(Path(__file__).with_name('build-spirit.py')),run_name='__main__')
