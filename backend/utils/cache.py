from aiocache import Cache
import functools
import hashlib
import json

# Initialize a simple memory cache
# You can switch to Redis or other backends if needed
cache = Cache(Cache.MEMORY)

def async_cache(ttl=3600):
    """
    Simple async cache decorator that hashes arguments to create keys.
    """
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Create a cache key based on function name and arguments
            key_data = {
                "func": func.__name__,
                "args": args[1:], # Skip 'self'
                "kwargs": kwargs
            }
            key = hashlib.md5(json.dumps(key_data, sort_keys=True).encode()).hexdigest()
            
            cached_val = await cache.get(key)
            if cached_val:
                print(f"Cache hit for {func.__name__}")
                return cached_val
            
            result = await func(*args, **kwargs)
            await cache.set(key, result, ttl=ttl)
            return result
        return wrapper
    return decorator
