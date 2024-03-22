from record import *


class LogReader:
    def __init__(self, filename: str, read_size: int = 1024) -> None:
        self.filename = filename
        self.read_size = read_size
        self.buffer = ""
        self.offset = 0

        self.file = open(filename)
        self.line_number = 0

    def close(self):
        self.file.close()

    def read_line(self):
        while True:
            index = self.buffer.find("\n", self.offset)

            if index >= 0:
                line = self.buffer[self.offset : index+ 1]
                self.offset = index + 1
                return line

            next = self.file.read(self.read_size)

            if not next:
                return None

            self.buffer = self.buffer[self.offset :] + next

    def read_record_header(self):
        while True:
            line = self.read_line()

            if line is None:
                return None, None

            if line:
                break

        return parse_record_header(line, self.line_number)
