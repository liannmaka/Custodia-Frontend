<template>
    <div>
        <ExclamationTriangle/>
        <h1>
            404 Not Found
        </h1>
        <p>This page does not exist</p>
        <RouterLink to="/">Go Back</RouterLink>
    </div>
</template>

<script setup lang="ts">
import { ExclamationTriangle } from '../components/icons';
</script>