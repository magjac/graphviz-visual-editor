#!/usr/bin/env python3

"""generator of versions JSON file from a CHANGELOG.md file"""

import json
import re
import sys
from typing import List

def main(args: List[str]) -> int: # pylint: disable=missing-function-docstring

  with open(args[1]) as fp:
    versions = {}
    for line in fp:
      mo = re.match("## \\[([0-9][^\\]]*)] [-–] (.*)$", line)
      if mo:
        version = mo.group(1)
        release_date = mo.group(2)
        versions[version] = {"release_date": release_date}

  print(json.dumps(versions, indent=4))

  return 0

if __name__ == "__main__":
  sys.exit(main(sys.argv))
