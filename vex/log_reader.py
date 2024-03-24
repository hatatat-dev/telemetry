from record import *


class LogReader:
    def __init__(self, filename: str, read_size: int = 1024) -> None:
        """Create a buffered reader for the log in the given file"""
        self.filename = filename
        self.read_size = read_size
        self.buffer = ""
        self.offset = 0

        self.file = open(filename)
        self.line_number = 0

    def close(self):
        """Close the log reader"""
        self.file.close()

    def read_line(self):
        """Read the next line, return string with it or None for end-of-file"""
        while True:
            index = self.buffer.find("\n", self.offset)

            if index >= 0:
                line = self.buffer[self.offset : index + 1]
                self.offset = index + 1
                return line

            next = self.file.read(self.read_size)

            if not next:
                return None

            self.buffer = self.buffer[self.offset :] + next
            self.offset = 0

    def read_record_header(self):
        """Read the next record header and rest of its string

        Return (RecordHeader, str) when there are args after the header,
        return (RecordHeader, None) when there are no args after the header,
        return (None, None) wwhen there is no next record (end-of-file).
        """
        while True:
            line = self.read_line()

            if line is None:
                return None, None

            if line:
                break

        return parse_record_header(line, self.line_number)
