"""
Monitoring Agent - أول Agent حقيقي في MSS HUB
مهمته: مراقبة صحة النظام وإرسال تنبيهات
"""

import asyncio
import httpx
from datetime import datetime
from typing import Dict, Any
from sqlalchemy.orm import Session
from app.db.database import SessionLocal
from app.models.user import User


class MonitoringAgent:
    """وكيل المراقبة - يراقب صحة النظام"""
    
    def __init__(self):
        self.name = "Monitoring Agent"
        self.status = "active"
        self.last_check = None
        self.check_interval = 60
        self.alerts = []
        self.checks_history = []
        
    async def check_backend_health(self) -> Dict[str, Any]:
        """فحص صحة الـ Backend"""
        try:
            async with httpx.AsyncClient() as client:
                # التصحيح الجذري: استخدام اسم خدمة Docker الداخلي 'backend'
                response = await client.get(
                    "http://backend:8000/health",
                    timeout=5.0
                )
                return {
                    "service": "backend",
                    "status": "healthy" if response.status_code == 200 else "unhealthy",
                    "response_time_ms": round(response.elapsed.total_seconds() * 1000, 2),
                    "timestamp": datetime.utcnow().isoformat()
                }
        except Exception as e:
            return {
                "service": "backend",
                "status": "down",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def check_database_health(self) -> Dict[str, Any]:
        """فحص صحة قاعدة البيانات"""
        try:
            db: Session = SessionLocal()
            user_count = db.query(User).count()
            db.close()
            return {
                "service": "database",
                "status": "healthy",
                "user_count": user_count,
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "service": "database",
                "status": "down",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def check_redis_health(self) -> Dict[str, Any]:
        """فحص صحة Redis"""
        try:
            import redis
            # اسم خدمة redis في شبكة Docker هو 'redis' والبورت الداخلي 6379
            r = redis.Redis(host='redis', port=6379, db=0)
            r.ping()
            return {
                "service": "redis",
                "status": "healthy",
                "timestamp": datetime.utcnow().isoformat()
            }
        except Exception as e:
            return {
                "service": "redis",
                "status": "down",
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            }
    
    async def run_health_check(self) -> Dict[str, Any]:
        """تشغيل فحص شامل للنظام"""
        print(f"🔍 [{self.name}] بدء فحص الصحة...")
        
        backend_status = await self.check_backend_health()
        database_status = await self.check_database_health()
        redis_status = await self.check_redis_health()
        
        self.last_check = datetime.utcnow()
        
        results = {
            "timestamp": self.last_check.isoformat(),
            "agent": self.name,
            "checks": {
                "backend": backend_status,
                "database": database_status,
                "redis": redis_status
            },
            "overall_status": "healthy" if all(
                s["status"] == "healthy" 
                for s in [backend_status, database_status, redis_status]
            ) else "unhealthy"
        }
        
        # تسجيل التنبيهات
        for service_name, status in results["checks"].items():
            if status["status"] != "healthy":
                alert = {
                    "service": service_name,
                    "status": status["status"],
                    "error": status.get("error", "Unknown"),
                    "timestamp": results["timestamp"]
                }
                self.alerts.append(alert)
                print(f"⚠️ [{self.name}] تنبيه: {service_name} - {status['status']}")
        
        # حفظ في التاريخ
        self.checks_history.append(results)
        if len(self.checks_history) > 100:
            self.checks_history = self.checks_history[-100:]
        
        print(f"✅ [{self.name}] اكتمل الفحص - الحالة: {results['overall_status']}")
        return results
    
    def get_last_status(self) -> Dict[str, Any]:
        """الحصول على آخر حالة"""
        if self.last_check:
            return {
                "agent": self.name,
                "status": self.status,
                "last_check": self.last_check.isoformat(),
                "total_alerts": len(self.alerts),
                "recent_alerts": self.alerts[-5:],
                "total_checks": len(self.checks_history)
            }
        return {"message": "لم يتم إجراء فحص بعد"}


# Instance واحد للـ Agent
monitoring_agent = MonitoringAgent()