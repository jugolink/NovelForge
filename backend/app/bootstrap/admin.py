import os
from sqlmodel import Session, select
from loguru import logger

from app.bootstrap.registry import initializer
from app.db.models import User
from app.core import security

@initializer(name="系统管理员", order=5)  # Make sure it runs early enough
def init_default_admin(session: Session) -> None:
    """初始化默认管理员账号"""
    logger.info("[Bootstrap] 检查系统用户...")
    
    admin_user = session.exec(select(User).where(User.username == "admin")).first()
    if not admin_user:
        logger.info("[Bootstrap] 未检测到 admin 用户，正在创建默认管理员账号...")
        # 从环境变量获取密码，或者使用默认密码 admin123
        admin_password = os.getenv("DEFAULT_ADMIN_PASSWORD", "admin123")
        hashed_pw = security.get_password_hash(admin_password)
        
        new_admin = User(
            username="admin",
            hashed_password=hashed_pw,
            is_active=True
        )
        session.add(new_admin)
        session.commit()
        
        logger.warning(f"[Bootstrap] 默认管理员已创建！账号: admin, 密码: {admin_password}")
        logger.warning("[Bootstrap] 强烈建议部署后通过配置环境变量 DEFAULT_ADMIN_PASSWORD 更改密码！")
    else:
        logger.info("[Bootstrap] 系统用户检查通过")
