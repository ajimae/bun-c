#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * 
 */
void save(const char* data) {
  FILE* file = fopen("cache.xc", "w");
  if (file == NULL) {
    perror("Failed to open cache.cdb for writing");
    return;
  }

  // fprintf(file, "%s", data);
  fputs(data, file);
  fclose(file);
}

const char* get() {
  static char buffer[8192];
  FILE* file = fopen("cache.xc", "r");
  if (file == NULL) {
    perror("Faile to open cache.xc for reading");
    return "";
  }

  size_t read = fread(buffer, 1, sizeof(buffer) - 1, file);
  buffer[read] = '\0';
  fclose(file);

  return buffer;
}
