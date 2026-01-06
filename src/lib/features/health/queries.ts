// src/lib/features/health/queries.ts (หรือ path ตามที่คุณจัด)
import { createQuery } from '@tanstack/svelte-query';
import * as api from './api'; // import api ที่คุณเขียนไว้

// 1. Query Keys Factory
// กำหนด key ไว้ที่เดียว เพื่อไม่ให้พิมพ์ string เองซ้ำๆ
export const healthKeys = {
	all: ['health'] as const,
	status: () => [...healthKeys.all, 'status'] as const
};

// 2. Custom Hook
export const useHealthStatus = () => {
	console.log('useHealthStatus called');
	return createQuery(() => ({
		queryKey: healthKeys.status(),
		// queryFn ต้องการ function ที่ return Promise ของ Data
		// ซึ่ง api.healthStatus ของคุณทำหน้าที่นี้อยู่แล้ว (ผ่าน apiRequest)
		queryFn: () => api.healthStatus()

		// Options เพิ่มเติม (Optional)
		// สำหรับ Health Check อาจจะไม่ต้อง cache นาน หรืออยากให้ refetch บ่อยๆ ก็ตั้งได้
		// staleTime: 1000 * 60, // ข้อมูลถือว่าสดใหม่ 1 นาที
		// refetchInterval: 1000 * 30 // ยิงเช็คทุก 30 วินาที
	}));
};
