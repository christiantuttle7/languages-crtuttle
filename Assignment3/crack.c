#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <pthread.h>
#include <stdbool.h>

#define MAX_LEN 5
#define CHARSET "abcdefghijklmnopqrstuvwxyz"
#define CHARSET_SIZE 26

typedef struct {
    unsigned long start;
    unsigned long end;
    char target[MAX_LEN + 1];
    int thread_id;
    unsigned long attempts;
} ThreadData;

static bool found = false;
static char result[MAX_LEN + 1];
pthread_mutex_t found_mutex = PTHREAD_MUTEX_INITIALIZER;

void number_to_password(unsigned long num, char *buf) {
    buf[MAX_LEN] = '\0';
    for (int i = MAX_LEN - 1; i >= 0; i--) {
        buf[i] = CHARSET[num % CHARSET_SIZE];
        num /= CHARSET_SIZE;
    }
}

void *worker(void *arg) {
    ThreadData *data = (ThreadData *)arg;
    char guess[MAX_LEN + 1];

    for (unsigned long i = data->start; i < data->end && !found; i++) {
        number_to_password(i, guess);
        data->attempts++;

        if (strcmp(guess, data->target) == 0) {
            pthread_mutex_lock(&found_mutex);
            if (!found) {
                found = true;
                strcpy(result, guess);
                printf("\nThread %d cracked it! Password: %s\n", data->thread_id, result);
            }
            pthread_mutex_unlock(&found_mutex);
            break;
        }

        if (data->attempts % 500000 == 0 && !found) {
            printf("Thread %d testing: %s (attempts: %lu)\r",
                    data->thread_id, guess, data->attempts);
            fflush(stdout);
        }
    }

    return NULL;
}

int main(int argc, char *argv[]) {
    if (argc != 3) {
        fprintf(stderr, "Usage: %s <password> <num_threads>\n", argv[0]);
        return 1;
    }

    if (strlen(argv[1]) != MAX_LEN) {
        fprintf(stderr, "Password must be exactly %d lowercase letters.\n", MAX_LEN);
        return 1;
    }

    unsigned long total = 1;
    for (int i = 0; i < MAX_LEN; i++) total *= CHARSET_SIZE;

    int num_threads = atoi(argv[2]);
    if (num_threads <= 0) {
        fprintf(stderr, "Invalid number of threads.\n");
        return 1;
    }

    ThreadData *td = malloc(num_threads * sizeof(ThreadData));
    pthread_t *threads = malloc(num_threads * sizeof(pthread_t));

    unsigned long chunk = total / num_threads;

    for (int i = 0; i < num_threads; i++) {
        td[i].start = i * chunk;
        td[i].end = (i == num_threads - 1) ? total : (i + 1) * chunk;
        strncpy(td[i].target, argv[1], MAX_LEN);
        td[i].thread_id = i;
        td[i].attempts = 0;

        pthread_create(&threads[i], NULL, worker, &td[i]);
    }

    for (int i = 0; i < num_threads; i++) {
        pthread_join(threads[i], NULL);
        printf("\nThread %d attempts: %lu\n", i, td[i].attempts);
    }

    if (found) {
        printf("\nSUCCESS! Password found: %s\n", result);
    } else {
        printf("\nPassword not found.\n");
    }

    free(td);
    free(threads);
    return 0;
}
