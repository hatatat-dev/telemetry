from record import *


class LogReader:
    def __init__(self, filename: str, read_size: int = 1024) -> None:
        """Create a buffered reader for the log in the given file"""
        self.filename = filename
        self.read_size = read_size

        # Buffer that may be partially read, and then - unread
        self.buffer = ""

        # Offset of the unread part of the buffer
        self.offset = 0

        self.file = open(filename)

        # Last read line number
        self.line_number = 0

    def close(self):
        """Close the log reader"""
        self.file.close()

    def read_line(self):
        """Read the next line, return string with it or None for end-of-file"""
        while True:
            index = self.buffer.find("\n", self.offset)

            if index >= 0:
                # Newline in the buffer, return line up to and including it
                self.line_number += 1
                line = self.buffer[self.offset : index + 1]
                self.offset = index + 1
                return line

            # No newline, line continues, read the next chunk
            next = self.file.read(self.read_size)

            if not next:
                # No next chunk, end of file
                return None

            # Reset buffer to the remainder of current plus next chunk
            self.buffer = self.buffer[self.offset :] + next

            # Reset unread offset to beginning of buffer
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
                # End of file
                return None, None

            if not line:
                # Skip empty lines
                continue

            if line.startswith(RECORD_HEADER_HEADER):
                # Skip header line(s)
                continue

            break

        return parse_record_header(line, self.line_number)
